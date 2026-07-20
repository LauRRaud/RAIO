import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Maksekeskus / MakeCommerce REST API klient (custom API integration).
 *
 * Dokumentatsioon: https://developer.makecommerce.net/guides/custom-api/RegularPaymentFlow/
 * Autentimine: HTTP Basic, kasutaja = Shop ID, parool = Secret key.
 *
 * SEE FAIL ON AINULT SERVERIS. Secret key ei tohi kunagi brauserisse jõuda,
 * seega ära impordi seda "use client" komponentidesse.
 */

const TEST_BASE_URL = "https://api.test.maksekeskus.ee/v1";
const LIVE_BASE_URL = "https://api.maksekeskus.ee/v1";

// Maksekeskuse avalikud testkontod (PHP SDK Environment.php). Kasutame neid
// vaikimisi test-režiimis, et poodi saaks katsetada enne päris lepingut.
const TEST_SHOP_ID = "3425d8b7-0225-4367-8c6f-16b1aba8d766";
const TEST_SECRET_KEY = "J5S4lcVjC1QfJec8IQPhHSKeAiEf10bPV7KrHPx9AmIl9nCoEtNtJo63SF0YKpFQ";

// Maksekeskuse teavitusserverite IP-d. Kasutame ainult logimiseks/hoiatuseks —
// MAC-allkiri on tegelik turvakontroll.
export const NOTIFICATION_IPS = {
  test: "52.16.36.6",
  live: "54.216.62.172"
};

export class PaymentError extends Error {
  constructor(message, { status = 502, details } = {}) {
    super(message);
    this.name = "PaymentError";
    this.status = status;
    this.details = details;
  }
}

export function getPaymentConfig() {
  const live = process.env.MAKSEKESKUS_MODE === "live";
  // Päris võtmed käivad alati üle; testrežiimis kukume avalikele testvõtmetele.
  const shopId = process.env.MAKSEKESKUS_SHOP_ID || (live ? "" : TEST_SHOP_ID);
  const secretKey = process.env.MAKSEKESKUS_SECRET_KEY || (live ? "" : TEST_SECRET_KEY);

  return {
    live,
    shopId,
    secretKey,
    baseUrl: live ? LIVE_BASE_URL : TEST_BASE_URL,
    configured: Boolean(shopId && secretKey)
  };
}

/**
 * Avalik saidi aadress, mille pealt ehitame return/cancel/notification URL-id.
 * Maksekeskus kutsub notification_url-i väljastpoolt, seega localhost ei tööta
 * — arenduses tuleb SITE_URL seada tunneli aadressiks (nt ngrok).
 */
export function getSiteUrl(request) {
  const configured = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");

  const headers = request?.headers;
  const forwardedHost = headers?.get("x-forwarded-host");
  const host = forwardedHost || headers?.get("host");

  if (host) {
    const proto = headers?.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

function authHeader() {
  const { shopId, secretKey } = getPaymentConfig();
  return `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`;
}

async function apiRequest(path, { method = "GET", body } = {}) {
  const config = getPaymentConfig();

  if (!config.configured) {
    throw new PaymentError(
      "Maksekeskus pole seadistatud: puudub MAKSEKESKUS_SHOP_ID või MAKSEKESKUS_SECRET_KEY.",
      { status: 503 }
    );
  }

  let response;

  try {
    response = await fetch(`${config.baseUrl}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader()
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store"
    });
  } catch (error) {
    throw new PaymentError(`Maksekeskusega ühendumine ebaõnnestus: ${error.message}`);
  }

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    throw new PaymentError(`Maksekeskus vastas veaga (${response.status}).`, {
      status: response.status === 429 ? 429 : 502,
      details: payload || text
    });
  }

  return payload;
}

/**
 * Summa peab minema stringina kahe komakohaga (CreateTransactionsSchema.json:
 * amount on string pattern ^[0-9]+([.][0-9]+)?$).
 */
export function formatAmount(value) {
  return (Math.round(Number(value) * 100) / 100).toFixed(2);
}

/**
 * POST /v1/transactions — loob tehingu ja tagastab makseviisid.
 * Vastus: { id, payment_methods: { banklinks[], cards[], paylater[], other[] } }
 */
export function createTransaction({
  amount,
  currency = "EUR",
  reference,
  merchantData,
  customer,
  urls
}) {
  return apiRequest("/transactions", {
    method: "POST",
    body: {
      transaction: {
        amount: formatAmount(amount),
        currency,
        reference,
        merchant_data: merchantData,
        transaction_url: {
          return_url: { url: urls.returnUrl, method: "GET" },
          cancel_url: { url: urls.cancelUrl, method: "GET" },
          notification_url: { url: urls.notificationUrl, method: "POST" }
        }
      },
      customer
    }
  });
}

/** GET /v1/transactions/{id} — tehingu hetkeseis. */
export function getTransaction(id) {
  return apiRequest(`/transactions/${encodeURIComponent(id)}`);
}

/**
 * Maksekeskuse hostitud maksevalikute leht: payment_methods.other massiivis
 * kirje nimega "redirect". Sinna suunates näeb klient kõiki panku ja kaarte.
 */
export function getRedirectUrl(transaction) {
  const other = transaction?.payment_methods?.other;
  if (!Array.isArray(other)) return null;

  const redirect = other.find((method) => method?.name === "redirect");
  return redirect?.url || null;
}

/**
 * MAC = UPPERCASE(HEX(SHA-512(json + secretKey))).
 * Kehtib nii teavituse (notification) kui ka return/cancel päringute puhul.
 */
export function composeMac(json) {
  const { secretKey } = getPaymentConfig();
  return createHash("sha512").update(`${json}${secretKey}`, "utf8").digest("hex").toUpperCase();
}

export function verifyMac(json, mac) {
  if (typeof json !== "string" || typeof mac !== "string" || !json || !mac) return false;

  const expected = composeMac(json);
  const received = mac.toUpperCase();

  // timingSafeEqual viskab erineva pikkuse korral — kontrolli enne.
  if (expected.length !== received.length) return false;

  return timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(received, "utf8"));
}

/**
 * Loeb json+mac paari (teavitus tuleb POST form-encoded, return/cancel GET
 * query-parameetritena) ja tagastab valideeritud payloadi või null-i.
 */
export function parseSignedPayload(json, mac) {
  if (!verifyMac(json, mac)) return null;

  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Maksekeskuse tehingu staatus -> RA•IO Orders kirje väljad.
 * COMPLETED on ainus staatus, mille järel kaupa toota/saata tohib.
 */
export function mapTransactionStatus(status) {
  switch (status) {
    case "COMPLETED":
      return { paymentStatus: "paid", orderStatus: "new", settled: true };
    case "REFUNDED":
      return { paymentStatus: "refunded", orderStatus: "cancelled", settled: true };
    case "PART_REFUNDED":
      return { paymentStatus: "partial", orderStatus: null, settled: true };
    case "CANCELLED":
    case "EXPIRED":
      return { paymentStatus: "pending", orderStatus: "cancelled", settled: true };
    // PENDING ja APPROVED ei garanteeri makset — jäta tellimus ootele.
    default:
      return { paymentStatus: "pending", orderStatus: null, settled: false };
  }
}
