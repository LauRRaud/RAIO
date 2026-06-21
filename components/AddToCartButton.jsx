"use client";

import { useEffect, useState } from "react";
import { getProductActionLabel, productActionLabels } from "@/lib/shop";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({ product, quantity = 1, label, addedLabel = "Lisatud", disabledLabel, getActionLabel }) {
  const { addItem } = useCart();
  const [wasAdded, setWasAdded] = useState(false);
  const resolvedLabel = label || (getActionLabel ? getActionLabel(product.status) : getProductActionLabel(product.status));
  const disabled = product.status === "TEMPORARILY_UNAVAILABLE";

  useEffect(() => {
    if (!wasAdded) return undefined;

    const timeoutId = window.setTimeout(() => setWasAdded(false), 1400);
    return () => window.clearTimeout(timeoutId);
  }, [wasAdded]);

  function handleClick() {
    addItem(product, quantity);
    setWasAdded(true);
  }

  return (
    <button
      type="button"
      className={`button button-primary add-to-cart${wasAdded ? " is-added" : ""}`}
      onClick={handleClick}
      disabled={disabled}
      title={disabled ? disabledLabel || productActionLabels.TEMPORARILY_UNAVAILABLE : undefined}
      aria-live="polite"
    >
      {wasAdded ? addedLabel : resolvedLabel}
    </button>
  );
}
