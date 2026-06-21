"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SelectPrimitive } from "@/components/SelectPrimitive";
import { getLocalizedPath } from "@/lib/i18n";

const sorters = {
  popularity: (items) => items,
  price: (items) => [...items].sort((a, b) => a.price - b.price),
  name: (items, locale) => [...items].sort((a, b) => a.name.localeCompare(b.name, locale))
};

export function StoreCatalog({ categories, products, locale = "et", labels }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortKey, setSortKey] = useState("popularity");
  const sortOptions = [
    { value: "popularity", label: labels.sort.popularity },
    { value: "price", label: labels.sort.price },
    { value: "name", label: labels.sort.name }
  ];

  const visibleProducts = useMemo(() => {
    const filtered =
      activeCategory === "all"
        ? products
        : products.filter((product) => product.category === activeCategory);

    return (sorters[sortKey] || sorters.popularity)(filtered, locale);
  }, [activeCategory, products, sortKey, locale]);

  return (
    <>
      <div className="store-products-header">
        <div>
          <h2 id="store-products-title">{labels.productsTitle}</h2>
          <nav className="store-category-nav" aria-label={labels.categoryNavLabel}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={activeCategory === category.id ? "is-active" : undefined}
                type="button"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>
        <SelectPrimitive
          aria-label={labels.sortLabel}
          className="store-sort"
          options={sortOptions}
          theme="dark"
          value={sortKey}
          onChange={setSortKey}
        />
      </div>

      <div className="store-product-grid">
        {visibleProducts.map((product) => (
          <article className="store-product-card" data-product={product.slug} key={product.slug}>
            <Link
              href={getLocalizedPath(locale, `/pood/${product.slug}`)}
              className="store-product-image"
              aria-label={product.name}
            >
              <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 900px) 50vw, 20vw" />
            </Link>
            <div className="store-product-body">
              <p className="store-product-category">{product.categoryLabel}</p>
              <h3>{product.name}</h3>
              <p className="store-price">
                <span>{labels.priceFrom}</span>
                <strong>{product.price}</strong>
                <span>€</span>
              </p>
              <ul className="store-product-meta">
                <li>{labels.metaPreorder}</li>
                <li>{labels.metaProduction}</li>
              </ul>
              <Link href={getLocalizedPath(locale, `/pood/${product.slug}`)} className="button button-primary add-to-cart">
                {labels.orderCta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
