"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SelectPrimitive } from "@/components/SelectPrimitive";
import { getLocalizedPath } from "@/lib/i18n";

const sorters = {
  popularity: (items) => items,
  price: (items) => [...items].sort((a, b) => a.price - b.price),
  name: (items, locale) =>
    [...items].sort((a, b) => a.name.localeCompare(b.name, locale)),
};

export function StoreCatalog({ categories, products, locale = "et", labels }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortKey, setSortKey] = useState("popularity");
  const productTrackRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  const sortOptions = [
    { value: "popularity", label: labels.sort.popularity },
    { value: "price", label: labels.sort.price },
    { value: "name", label: labels.sort.name },
  ];
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.label,
  }));

  const visibleProducts = useMemo(() => {
    const filtered =
      activeCategory === "all"
        ? products
        : products.filter((product) => product.category === activeCategory);

    return (sorters[sortKey] || sorters.popularity)(filtered, locale);
  }, [activeCategory, products, sortKey, locale]);

  useEffect(() => {
    const track = productTrackRef.current;

    if (!track) return undefined;

    const updateCanScroll = () => {
      setCanScroll(track.scrollWidth > track.clientWidth + 1);
    };
    const observer = new ResizeObserver(updateCanScroll);

    track.scrollTo({ left: 0, behavior: "smooth" });
    updateCanScroll();
    observer.observe(track);
    window.addEventListener("resize", updateCanScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateCanScroll);
    };
  }, [activeCategory, sortKey, visibleProducts.length]);

  function scrollProducts(direction) {
    const track = productTrackRef.current;

    if (!track) return;

    const card = track.querySelector(".store-product-card");
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    const distance = card
      ? card.getBoundingClientRect().width + gap
      : track.clientWidth * 0.82;

    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  return (
    <>
      <div className="store-products-header">
        <div>
          <h2 id="store-products-title">{labels.productsTitle}</h2>
          <nav
            className="store-category-nav"
            aria-label={labels.categoryNavLabel}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                className={
                  activeCategory === category.id ? "is-active" : undefined
                }
                type="button"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="store-filter-controls">
          <SelectPrimitive
            aria-label={labels.categoryNavLabel}
            className="store-category-select"
            options={categoryOptions}
            theme="dark"
            value={activeCategory}
            onChange={setActiveCategory}
          />
          <SelectPrimitive
            aria-label={labels.sortLabel}
            className="store-sort"
            options={sortOptions}
            theme="dark"
            value={sortKey}
            onChange={setSortKey}
          />
        </div>
      </div>

      <div className="store-product-carousel">
        {canScroll ? (
          <>
            <button
              className="store-product-arrow store-product-arrow-left"
              type="button"
              onClick={() => scrollProducts(-1)}
              aria-label={labels.carousel.previous}
            >
              <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
            </button>
            <button
              className="store-product-arrow store-product-arrow-right"
              type="button"
              onClick={() => scrollProducts(1)}
              aria-label={labels.carousel.next}
            >
              <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
            </button>
          </>
        ) : null}

        <div className="store-product-grid" ref={productTrackRef}>
          {visibleProducts.map((product) => (
            <article
              className="store-product-card"
              data-product={product.slug}
              key={product.slug}
            >
              <Link
                href={getLocalizedPath(locale, `/pood/${product.slug}`)}
                className="store-product-image"
                aria-label={product.name}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 620px) 100vw, 430px"
                />
              </Link>
              <div className="store-product-body">
                <p className="store-product-category">
                  {product.categoryLabel}
                </p>
                <h3>{product.name}</h3>
                <p className="store-price">
                  <span>{labels.priceFrom}</span>
                  <strong>{product.price}</strong>
                  <span>€</span>
                </p>
                <Link
                  href={getLocalizedPath(locale, `/pood/${product.slug}`)}
                  className="button button-primary add-to-cart"
                >
                  {labels.orderCta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
