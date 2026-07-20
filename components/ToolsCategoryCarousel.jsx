"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getLocalizedPath } from "@/lib/i18n";
import { scrollCarouselByCards } from "@/lib/carouselScroll";

export function ToolsCategoryCarousel({
  categories,
  cta,
  locale = "et",
  labels,
  title,
  titleId,
  allLabel,
}) {
  const categoryTrackRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const update = () => setItemsPerPage(window.innerWidth <= 620 ? 1 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const showNav = !showAll && categories.length > itemsPerPage;

  function scrollByCards(direction) {
    scrollCarouselByCards(categoryTrackRef.current, direction);
  }

  return (
    <>
      {title ? (
        <div className="tools-section-top">
          <h2 id={titleId}>{title}</h2>
          {showNav ? (
            <button
              type="button"
              className="carousel-all-link"
              onClick={() => setShowAll(true)}
            >
              {allLabel}
              <ArrowRight size={20} strokeWidth={1.6} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="tools-category-carousel">
      {showNav ? (
        <>
          <button
            className="tools-category-arrow tools-category-arrow-left"
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label={labels.previous}
          >
            <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button
            className="tools-category-arrow tools-category-arrow-right"
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label={labels.next}
          >
            <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div
        className={`tools-category-grid ${showAll ? "is-expanded" : ""}`}
        ref={categoryTrackRef}
      >
        {categories.map((category) => (
          <article className="tools-category-card" key={category.title}>
            <Link
              href={getLocalizedPath(locale, category.href)}
              className="tools-category-image"
              aria-label={category.title}
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                loading="eager"
                sizes="(max-width: 620px) 100vw, 430px"
              />
            </Link>
            <div className="tools-category-body">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <Link
                href={getLocalizedPath(locale, category.href)}
                className="tools-text-link"
              >
                {cta}
              </Link>
              {showNav ? (
                <div className="card-swipe-nav" aria-hidden="true">
                  <button
                    className="card-swipe-arrow"
                    type="button"
                    onClick={() => scrollByCards(-1)}
                    aria-label={labels.previous}
                    tabIndex={-1}
                  >
                    <ChevronLeft size={24} strokeWidth={1.7} aria-hidden="true" />
                  </button>
                  <button
                    className="card-swipe-arrow"
                    type="button"
                    onClick={() => scrollByCards(1)}
                    aria-label={labels.next}
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
