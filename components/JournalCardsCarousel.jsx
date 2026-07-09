"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { scrollCarouselByCards } from "@/lib/carouselScroll";

export function JournalCardsCarousel({ articles, readMore, modalClose, labels }) {
  const journalTrackRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const update = () => setItemsPerPage(window.innerWidth <= 620 ? 1 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!activeArticle) return undefined;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setActiveArticle(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeArticle]);

  function scrollByCards(direction) {
    scrollCarouselByCards(journalTrackRef.current, direction);
  }

  const showArrows = articles.length > itemsPerPage;

  return (
    <div className="journal-story-carousel">
      {showArrows ? (
        <>
          <button
            className="journal-story-arrow journal-story-arrow-left"
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label={labels.previous}
          >
            <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button
            className="journal-story-arrow journal-story-arrow-right"
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label={labels.next}
          >
            <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div className="journal-card-grid" ref={journalTrackRef}>
        {articles.map((article) => (
          <article className="journal-story-card" key={article.title}>
            <div className="journal-story-image">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 620px) 100vw, 540px"
              />
            </div>
            <div className="journal-story-body">
              <p className="journal-story-meta">
                <span className="journal-story-date">{article.date}</span>
                <span className="journal-story-category">
                  {article.category}
                </span>
              </p>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <button
                type="button"
                className="journal-text-link"
                onClick={() => setActiveArticle(article)}
                aria-haspopup="dialog"
              >
                {readMore}
              </button>
              {showArrows ? (
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

      {activeArticle && typeof document !== "undefined" ? createPortal(
        <div
          className="journal-article-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveArticle(null);
            }
          }}
        >
          <article
            className="journal-article-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="journal-article-dialog-title"
          >
            <button
              type="button"
              className="journal-article-close"
              onClick={() => setActiveArticle(null)}
              aria-label={modalClose}
              ref={closeButtonRef}
            >
              <X size={24} strokeWidth={1.7} aria-hidden="true" />
            </button>

            <div className="journal-article-content">
              <p className="journal-story-meta">
                <span className="journal-story-date">{activeArticle.date}</span>
                <span className="journal-story-category">
                  {activeArticle.category}
                </span>
              </p>
              <h2 id="journal-article-dialog-title">{activeArticle.title}</h2>
              <p className="journal-article-lead">{activeArticle.excerpt}</p>
              <div className="journal-article-copy">
                {(activeArticle.body || [activeArticle.excerpt]).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        </div>,
        document.body
      ) : null}
    </div>
  );
}
