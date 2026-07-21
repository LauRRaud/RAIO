"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { TextureSlideshowClient } from "@/components/TextureSlideshowClient";
import { formatCurrency, isProductionProduct } from "@/lib/shop";
import { getLocalizedProducts } from "@/lib/messages";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CartView({
  locale = "et",
  shopHref = "/pood",
  labels,
  textures
}) {
  const backdrop = textures?.images?.length ? (
    <TextureSlideshowClient set="terracotta" images={textures.images} interval={textures.interval} />
  ) : null;
  const { items, setQuantity, removeItem, clearCart } = useCart();
  const localizedProducts = useMemo(() => getLocalizedProducts(locale), [locale]);
  const localizedProductBySlug = useMemo(
    () => new Map(localizedProducts.map((product) => [product.slug, product])),
    [localizedProducts]
  );
  const localizedItems = useMemo(
    () =>
      items.map((item) => ({
        ...(localizedProductBySlug.get(item.slug) || {}),
        ...item,
        quantity: item.quantity
      })),
    [items, localizedProductBySlug]
  );
  const subtotal = localizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasProductionItems = localizedItems.some((item) => isProductionProduct(item.status));

  const form = labels.checkoutForm;
  const [stage, setStage] = useState("cart");
  const [fields, setFields] = useState({ name: "", email: "", phone: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(key, value) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function handleCheckout(event) {
    event.preventDefault();
    setError("");

    if (!fields.name.trim() || !fields.email.trim()) {
      setError(form.required);
      return;
    }

    if (!EMAIL_RE.test(fields.email.trim())) {
      setError(form.invalidEmail);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          items: items.map((item) => ({ slug: item.slug, quantity: item.quantity })),
          customer: {
            name: fields.name.trim(),
            email: fields.email.trim(),
            phone: fields.phone.trim(),
            note: fields.note.trim()
          }
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.redirectUrl) {
        setError(form.error);
        setSubmitting(false);
        return;
      }

      // Suuname Maksekeskuse hostitud maksevalikute lehele. Ostukorv jääb
      // alles seniks, kuni makse õnnestub (tühjendame tulemuslehel).
      window.location.href = data.redirectUrl;
    } catch {
      setError(form.error);
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="section cart-empty">
        {backdrop}
        <div className="container cart-empty-inner">
          <div className="cart-empty-heading">
            <h1>{labels.emptyTitle}</h1>
          </div>
          <div className="cart-empty-note">
            <p>{labels.emptyCopy}</p>
            <Link href={shopHref} className="cart-text-action">
              {labels.shopButton}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section cart-section">
      {backdrop}
      <div className="container cart-shell">
        <div className="cart-heading">
          <h1>{labels.eyebrow}</h1>
        </div>
      </div>

      <div className="container cart-layout">
        <div className="cart-items">
          {localizedItems.map((item) => {
            const warning = isProductionProduct(item.status)
              ? labels.productionWarning.replace("{time}", item.estimatedProductionTime)
              : "";
            const productHref = `${shopHref}/${item.slug}`;

            return (
              <article key={item.slug} className="cart-item">
                <Link href={productHref} className="cart-swatch" aria-label={item.name}>
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    loading="eager"
                    sizes="(max-width: 720px) calc(100vw - 32px), 18vw"
                  />
                </Link>
                <div className="cart-item-copy">
                  <div className="cart-item-top">
                    <div>
                      <h3>
                        <Link href={productHref}>{item.name}</Link>
                      </h3>
                      <p>{item.description}</p>
                    </div>
                    <div
                      className="cart-item-price"
                      aria-label={`${item.quantity} x ${formatCurrency(item.price)}, ${labels.totalLabel} ${formatCurrency(
                        item.price * item.quantity
                      )}`}
                    >
                      <strong>{formatCurrency(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                  {warning ? <p className="cart-warning">{warning}</p> : null}
                  <div className="cart-item-controls">
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.slug, item.quantity - 1)}
                        aria-label={labels.decrease.replace("{name}", item.name)}
                      >
                        <Minus size={19} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.slug, item.quantity + 1)}
                        aria-label={labels.increase.replace("{name}", item.name)}
                      >
                        <Plus size={19} />
                      </button>
                    </div>
                    <button type="button" className="remove-item" onClick={() => removeItem(item.slug)}>
                      <Trash2 size={19} />
                      {labels.remove}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="cart-summary">
          <h2>{labels.summaryTitle}</h2>
          <div className="summary-row">
            <span>{labels.subtotal}</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>{labels.shippingTitle}</span>
            <strong>{labels.shippingLabel}</strong>
          </div>
          {hasProductionItems ? <div className="summary-warning">{labels.production}</div> : null}

          {stage === "cart" ? (
            <div className="summary-actions">
              <button
                type="button"
                className="cart-solid-action"
                onClick={() => {
                  setError("");
                  setStage("form");
                }}
              >
                {labels.checkout}
              </button>
              <button type="button" className="cart-quiet-action" onClick={clearCart}>
                {labels.clear}
              </button>
            </div>
          ) : (
            <form className="cart-checkout-form" onSubmit={handleCheckout} noValidate>
              <p className="cart-checkout-title">{form.title}</p>

              <label className="cart-field">
                <span>{form.name}</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={fields.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  disabled={submitting}
                />
              </label>

              <label className="cart-field">
                <span>{form.email}</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={fields.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  disabled={submitting}
                />
              </label>

              <label className="cart-field">
                <span>{form.phone}</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={fields.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  disabled={submitting}
                />
              </label>

              <label className="cart-field">
                <span>{form.note}</span>
                <textarea
                  name="note"
                  rows={3}
                  value={fields.note}
                  onChange={(event) => updateField("note", event.target.value)}
                  disabled={submitting}
                />
              </label>

              {error ? (
                <p className="cart-checkout-error" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="summary-actions">
                <button type="submit" className="cart-solid-action" disabled={submitting}>
                  {submitting ? form.submitting : form.submit}
                </button>
                <button
                  type="button"
                  className="cart-quiet-action"
                  onClick={() => setStage("cart")}
                  disabled={submitting}
                >
                  {form.back}
                </button>
              </div>

              <p className="cart-checkout-secure">{form.secure}</p>
            </form>
          )}
        </aside>
      </div>
    </section>
  );
}
