"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getLocalizedPath } from "@/lib/i18n";

export function ToolsCategoryCarousel({ categories, cta, locale = "et", labels }) {
  const categoryTrackRef = useRef(null);
  const touchStartX = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isFading, setIsFading] = useState(false);

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

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  function changePage(direction) {
    if (isFading || totalPages <= 1) return;

    let newPage = currentPage + direction;
    if (newPage >= totalPages) newPage = 0;
    if (newPage < 0) newPage = totalPages - 1;

    setIsFading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsFading(false);
        });
      });
    }, 150);
  }

  const visibleCategories = categories.slice(
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
    <div className="tools-category-carousel">
      {totalPages > 1 ? (
        <>
          <button
            className="tools-category-arrow tools-category-arrow-left"
            type="button"
            onClick={() => changePage(-1)}
            aria-label={labels.previous}
          >
            <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button
            className="tools-category-arrow tools-category-arrow-right"
            type="button"
            onClick={() => changePage(1)}
            aria-label={labels.next}
          >
            <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div className={`tools-category-grid fade-transition ${isFading ? 'fade-out' : ''}`} ref={categoryTrackRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {visibleCategories.map((category) => (
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
              {totalPages > 1 ? (
                <div className="card-swipe-nav" aria-hidden="true">
                  <button
                    className="card-swipe-arrow"
                    type="button"
                    onClick={() => changePage(-1)}
                    aria-label={labels.previous}
                    tabIndex={-1}
                  >
                    <ChevronLeft size={24} strokeWidth={1.7} aria-hidden="true" />
                  </button>
                  <button
                    className="card-swipe-arrow"
                    type="button"
                    onClick={() => changePage(1)}
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
  );
}
