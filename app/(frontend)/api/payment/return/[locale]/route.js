import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { parseSignedPayload, mapTransactionStatus } from "@/lib/maksekeskus";
import { findOrderForNotification, applyTransactionStatus } from "@/lib/orders";
import { isLocale, defaultLocale, getLocalizedPath } from "@/lib/i18n";

/**
 * GET /api/payment/return/{locale} — koht, kuhu Maksekeskus suunab kliendi
 * tagasi pärast maksmist (nii õnnestumine kui katkestamine).
 *
 * Kontrollime MAC-i, uuendame tellimuse staatust (kui teavitus mingil põhjusel
 * hilineb) ja suuname kliendi keelekohasele /makse tulemuslehele. Makse
 * lõplik kinnitus tuleb siiski notify-webhookilt.
 */

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const url = new URL(request.url);
  const json = url.searchParams.get("json");
  const mac = url.searchParams.get("mac");

  const result = new URL(getLocalizedPath(locale, "/makse"), url.origin);

  const notification = parseSignedPayload(json, mac);

  if (!notification) {
    result.searchParams.set("status", "error");
    return NextResponse.redirect(result, { status: 303 });
  }

  const payload = await getPayload({ config });
  const order = await findOrderForNotification(payload, notification);

  if (order) {
    try {
      await applyTransactionStatus(payload, order, notification);
    } catch (err) {
      console.error("Tellimuse staatuse uuendamine (return) ebaõnnestus:", err);
    }

    result.searchParams.set("order", order.orderNumber);
  }

  const mapped = mapTransactionStatus(notification.status);
  const status = mapped.paymentStatus === "paid" ? "ok" : mapped.settled ? "failed" : "pending";
  result.searchParams.set("status", status);

  return NextResponse.redirect(result, { status: 303 });
}
