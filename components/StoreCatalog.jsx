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
  const touchStartX = useRef(null);
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

  // Preselect a category when the shop is opened with a ?kategooria=<id> link
  // (e.g. from the tools page category cards). Read after mount to avoid a
  // hydration mismatch — the server always renders the "all" default.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("kategooria");

    if (requested && categories.some((category) => category.id === requested)) {
      setActiveCategory(requested);

      // Land on the product carousel, not the hero, when arriving via a
      // category deep-link.
      requestAnimationFrame(() => {
        const section = document.querySelector(".store-products-section");

        if (section) {
          const top = section.getBoundingClientRect().top + window.scrollY - 24;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    }
  }, [categories]);

  const visibleProducts = useMemo(() => {
    const filtered =
      activeCategory === "all"
        ? products
        : products.filter((product) => product.category === activeCategory);

    return (sorters[sortKey] || sorters.popularity)(filtered, locale);
  }, [activeCategory, products, sortKey, locale]);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth <= 620 ? 1 : 3);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  const totalPages = Math.ceil(visibleProducts.length / itemsPerPage);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  // Reset to first page when category/sort changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategory, sortKey]);

  function changePage(direction) {
    if (totalPages <= 1) return;

    let newPage = currentPage + direction;
    if (newPage >= totalPages) newPage = 0;
    if (newPage < 0) newPage = totalPages - 1;

    setCurrentPage(newPage);
  }

  const paginatedProducts = visibleProducts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current == null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) > 45) changePage(deltaX < 0 ? 1 : -1);
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
        {totalPages > 1 ? (
          <>
            <button
              className="store-product-arrow store-product-arrow-left"
              type="button"
              onClick={() => changePage(-1)}
              aria-label={labels.carousel.previous}
            >
              <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
            </button>
            <button
              className="store-product-arrow store-product-arrow-right"
              type="button"
              onClick={() => changePage(1)}
              aria-label={labels.carousel.next}
            >
              <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
            </button>
          </>
        ) : null}

        <div className="store-product-grid" ref={productTrackRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {paginatedProducts.map((product) => (
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
                {totalPages > 1 ? (
                  <div className="card-swipe-nav" aria-hidden="true">
                    <button
                      className="card-swipe-arrow"
                      type="button"
                      onClick={() => changePage(-1)}
                      aria-label={labels.carousel.previous}
                      tabIndex={-1}
                    >
                      <ChevronLeft size={24} strokeWidth={1.7} aria-hidden="true" />
                    </button>
                    <button
                      className="card-swipe-arrow"
                      type="button"
                      onClick={() => changePage(1)}
                      aria-label={labels.carousel.next}
                      tabIndex={-1}
                    >
                      <ChevronRight size={24} strokeWidth={1.7} aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
