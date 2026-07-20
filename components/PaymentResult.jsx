"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { getLocalizedPath } from "@/lib/i18n";

const STATES = ["ok", "failed", "pending", "error"];
const ICONS = {
  ok: CheckCircle2,
  failed: XCircle,
  pending: Clock,
  error: XCircle
};

export function PaymentResult({ locale = "et", status, orderNumber, labels }) {
  const { clearCart } = useCart();
  const key = STATES.includes(status) ? status : "pending";

  // Õnnestunud makse järel ei ole ostukorbil enam mõtet — tühjenda see.
  useEffect(() => {
    if (key === "ok") clearCart();
  }, [key, clearCart]);

  const copy = labels[key];
  const Icon = ICONS[key];
  const isSuccess = key === "ok";

  return (
    <section className="section payment-result">
      <div className="container payment-result-inner">
        <Icon
          className={`payment-result-icon payment-result-icon-${key}`}
          size={56}
          strokeWidth={1.4}
          aria-hidden="true"
        />
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        {orderNumber ? (
          <p className="payment-result-order">
            {labels.orderLabel}: <strong>{orderNumber}</strong>
          </p>
        ) : null}
        <div className="payment-result-actions">
          <Link
            href={getLocalizedPath(locale, isSuccess ? "/pood" : "/ostukorv")}
            className="cart-solid-action"
          >
            {isSuccess ? labels.continueShopping : labels.backToCart}
          </Link>
          <Link href={getLocalizedPath(locale, "/")} className="cart-quiet-action">
            {labels.backHome}
          </Link>
        </div>
      </div>
    </section>
  );
}
