"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export function CartButton({ href = "/ostukorv", label = "Ostukorv", countLabel = "toodet" }) {
  const { itemCount } = useCart();

  return (
    <Link
      href={href}
      className="cart-button"
      aria-label={`${label}, ${itemCount} ${countLabel}`}
    >
      <ShoppingCart size={20} strokeWidth={1.9} />
      {itemCount > 0 ? <span className="cart-count">{itemCount}</span> : null}
    </Link>
  );
}
