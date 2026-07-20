import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { parseSignedPayload } from "@/lib/maksekeskus";
import { findOrderForNotification, applyTransactionStatus } from "@/lib/orders";

/**
 * POST /api/payment/notify — Maksekeskuse server-to-server teavitus.
 *
 * SEE on makse tegelik tõeallikas: brauser võib return-lehele mitte jõuda,
 * aga see teavitus tuleb Maksekeskuse serverist alati. MAC-allkiri kinnitab,
 * et päring on ehtne. Vastame 200-ga, muidu Maksekeskus proovib uuesti.
 */

export const dynamic = "force-dynamic";

async function readJsonMac(request) {
  const url = new URL(request.url);
  const queryJson = url.searchParams.get("json");
  const queryMac = url.searchParams.get("mac");

  if (queryJson && queryMac) {
    return { json: queryJson, mac: queryMac };
  }

  const contentType = request.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const parsed = await request.json();
      return { json: parsed?.json ?? null, mac: parsed?.mac ?? null };
    }

    // Vaikimisi tuleb teavitus application/x-www-form-urlencoded kujul.
    const form = await request.formData();
    return { json: form.get("json"), mac: form.get("mac") };
  } catch {
    return { json: null, mac: null };
  }
}

export async function POST(request) {
  const { json, mac } = await readJsonMac(request);
  const notification = parseSignedPayload(json, mac);

  if (!notification) {
    return NextResponse.json({ error: "invalid_mac" }, { status: 400 });
  }

  const payload = await getPayload({ config });
  const order = await findOrderForNotification(payload, notification);

  if (!order) {
    // Tundmatu tellimus — kinnita kättesaamine (et kordust ei tuleks), aga logi.
    console.warn(
      "Maksekeskuse teavitus tundmatule tellimusele:",
      notification?.reference,
      notification?.transaction
    );
    return NextResponse.json({ ok: true, matched: false });
  }

  try {
    await applyTransactionStatus(payload, order, notification);
  } catch (err) {
    console.error("Tellimuse staatuse uuendamine (notify) ebaõnnestus:", err);
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
