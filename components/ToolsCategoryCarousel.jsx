"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getLocalizedPath } from "@/lib/i18n";

export function ToolsCategoryCarousel({ categories, cta, locale = "et", labels }) {
  const categoryTrackRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const track = categoryTrackRef.current;

    if (!track) return undefined;

    const updateCanScroll = () => {
      setCanScroll(track.scrollWidth > track.clientWidth + 1);
    };
    const observer = new ResizeObserver(updateCanScroll);

    updateCanScroll();
    observer.observe(track);
    window.addEventListener("resize", updateCanScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateCanScroll);
    };
  }, [categories.length]);

  function scrollCategories(direction) {
    const track = categoryTrackRef.current;

    if (!track) return;

    const card = track.querySelector(".tools-category-card");
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    const distance = card
      ? card.getBoundingClientRect().width + gap
      : track.clientWidth * 0.82;

    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  return (
    <div className="tools-category-carousel">
      {canScroll ? (
        <>
          <button
            className="tools-category-arrow tools-category-arrow-left"
            type="button"
            onClick={() => scrollCategories(-1)}
            aria-label={labels.previous}
          >
            <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button
            className="tools-category-arrow tools-category-arrow-right"
            type="button"
            onClick={() => scrollCategories(1)}
            aria-label={labels.next}
          >
            <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div className="tools-category-grid" ref={categoryTrackRef}>
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
                sizes="(max-width: 620px) 82vw, 430px"
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
                <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
