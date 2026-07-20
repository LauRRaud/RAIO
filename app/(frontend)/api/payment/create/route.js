import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { resolveCartItems, generateOrderNumber } from "@/lib/orders";
import {
  createTransaction,
  getRedirectUrl,
  getSiteUrl,
  PaymentError
} from "@/lib/maksekeskus";
import { isLocale, defaultLocale } from "@/lib/i18n";

/**
 * POST /api/payment/create — algatab veebimakse.
 *
 * Klient saadab ainult ostukorvi read (slug + kogus) ja oma kontaktandmed.
 * Hinnad ehitatakse serveripoolsest hinnakirjast (resolveCartItems), luuakse
 * Payloadi tellimus staatuses "pending" ja Maksekeskuse tehing. Tagastame
 * Maksekeskuse hostitud maksevalikute lehe URL-i, kuhu klient suunatakse.
 */

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const locale = isLocale(body?.locale) ? body.locale : defaultLocale;
  const customer = body?.customer || {};
  const name = String(customer.name || "").trim();
  const email = String(customer.email || "").trim();
  const phone = String(customer.phone || "").trim();
  const note = String(customer.note || "").trim();
  const delivery = String(customer.delivery || "").trim();

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 160) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const { items, total, error } = resolveCartItems(locale, body?.items);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const payload = await getPayload({ config });

  // Loo tellimus unikaalse numbriga. orderNumber on unique — samaaegse
  // tellimuse korral proovime järgmise numbriga uuesti.
  let order = null;

  for (let attempt = 0; attempt < 5 && !order; attempt++) {
    const orderNumber = await generateOrderNumber(payload);

    try {
      order = await payload.create({
        collection: "orders",
        overrideAccess: true,
        data: {
          orderNumber,
          status: "new",
          source: "website",
          customerName: name,
          customerEmail: email,
          customerPhone: phone || undefined,
          deliveryPreference: delivery || undefined,
          customerMessage: note || undefined,
          items: items.map((item) => ({
            customName: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            productionNote: item.productionNote || undefined
          })),
          orderTotal: total,
          paymentStatus: "pending"
        }
      });
    } catch (err) {
      if (attempt === 4) {
        console.error("Tellimuse loomine ebaõnnestus:", err);
        return NextResponse.json({ error: "order_failed" }, { status: 500 });
      }
      // Tõenäoliselt orderNumber-i unique konflikt — proovi järgmist numbrit.
    }
  }

  const siteUrl = getSiteUrl(request);

  let transaction;

  try {
    transaction = await createTransaction({
      amount: total,
      reference: order.orderNumber,
      merchantData: String(order.id),
      customer: {
        email,
        ip: clientIp(request),
        country: "ee",
        locale: locale === "en" ? "en" : "et"
      },
      urls: {
        // Keel käib return-URL-i teel (mitte query-parameetrina), sest
        // Maksekeskus lisab ise json+mac query-sse.
        returnUrl: `${siteUrl}/api/payment/return/${locale}`,
        cancelUrl: `${siteUrl}/api/payment/return/${locale}`,
        notificationUrl: `${siteUrl}/api/payment/notify`
      }
    });
  } catch (err) {
    const status = err instanceof PaymentError ? err.status : 502;
    console.error("Maksekeskuse tehingu loomine ebaõnnestus:", err);
    // Tellimus jääb "pending" staatusesse — selle saab hiljem käsitsi lahendada.
    return NextResponse.json({ error: "payment_unavailable" }, { status });
  }

  const redirectUrl = getRedirectUrl(transaction);

  await payload.update({
    collection: "orders",
    id: order.id,
    overrideAccess: true,
    data: {
      maksekeskusTransactionId: transaction?.id || undefined,
      maksekeskusStatus: transaction?.status || undefined
    }
  });

  if (!redirectUrl) {
    console.error("Maksekeskuse vastuses puudub redirect-URL:", transaction?.id);
    return NextResponse.json({ error: "payment_unavailable" }, { status: 502 });
  }

  return NextResponse.json({ redirectUrl, orderNumber: order.orderNumber });
}
