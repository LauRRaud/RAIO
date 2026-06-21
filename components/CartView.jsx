"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useCart } from "@/components/CartProvider";
import { createCheckoutMailto, formatCurrency, isProductionProduct } from "@/lib/shop";
import { getLocalizedProducts } from "@/lib/messages";

export function CartView({
  locale = "et",
  recipientEmail,
  shopHref = "/pood",
  labels
}) {
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
  const checkoutHref = createCheckoutMailto(localizedItems, recipientEmail, labels);
  const hasProductionItems = localizedItems.some((item) => isProductionProduct(item.status));

  if (items.length === 0) {
    return (
      <section className="section cart-empty">
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
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.slug, item.quantity + 1)}
                        aria-label={labels.increase.replace("{name}", item.name)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button type="button" className="remove-item" onClick={() => removeItem(item.slug)}>
                      <Trash2 size={16} />
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
          <div className="summary-actions">
            <a href={checkoutHref} className="cart-solid-action">
              {labels.checkout}
            </a>
            <button type="button" className="cart-quiet-action" onClick={clearCart}>
              {labels.clear}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
