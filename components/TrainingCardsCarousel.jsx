"use client";

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LineIcon } from "@/components/Icons";
import { scrollCarouselByCards } from "@/lib/carouselScroll";

export function TrainingCardsCarousel({
  trainings,
  cta,
  modalClose,
  labels,
  title,
  titleId,
  allLabel,
}) {
  const trainingTrackRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [activeTraining, setActiveTraining] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const update = () => setItemsPerPage(window.innerWidth <= 620 ? 1 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!activeTraining) return undefined;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setActiveTraining(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeTraining]);

  function scrollByCards(direction) {
    scrollCarouselByCards(trainingTrackRef.current, direction);
  }

  const showArrows = !showAll && trainings.length > itemsPerPage;

  return (
    <>
      {title ? (
        <div className="training-section-intro">
          <h2 id={titleId}>{title}</h2>
          {showArrows ? (
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

      <div className="training-card-carousel">
      {showArrows ? (
        <>
          <button
            className="training-card-arrow training-card-arrow-left"
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label={labels.previous}
          >
            <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button
            className="training-card-arrow training-card-arrow-right"
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label={labels.next}
          >
            <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div
        className={`training-card-grid ${showAll ? "is-expanded" : ""}`}
        ref={trainingTrackRef}
      >
        {trainings.map((training) => (
          <article className="training-card" key={training.title}>
            <div className="training-card-image">
              <Image
                src={training.image}
                alt={training.title}
                fill
                loading="eager"
                sizes="(max-width: 620px) 100vw, 430px"
              />
            </div>
            <div className="training-card-body">
              <h3>{training.title}</h3>
              <p>{training.description}</p>
              <div className="training-meta">
                <span>
                  <LineIcon type="clock" />
                  {training.duration}
                </span>
                <span>
                  <LineIcon type="chart" />
                  {training.level}
                </span>
              </div>
              <button
                type="button"
                className="training-text-link"
                onClick={() => setActiveTraining(training)}
                aria-haspopup="dialog"
              >
                {cta}
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

      {activeTraining && typeof document !== "undefined" ? createPortal(
        <div
          className="training-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveTraining(null);
            }
          }}
        >
          <article
            className="training-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="training-dialog-title"
          >
            <button
              type="button"
              className="training-modal-close"
              onClick={() => setActiveTraining(null)}
              aria-label={modalClose}
              ref={closeButtonRef}
            >
              <X size={24} strokeWidth={1.7} aria-hidden="true" />
            </button>

            <div className="training-modal-content">
              <h2 id="training-dialog-title">{activeTraining.title}</h2>
              <p className="training-modal-lead">{activeTraining.description}</p>
              <div className="training-meta">
                <span>
                  <LineIcon type="clock" />
                  {activeTraining.duration}
                </span>
                <span>
                  <LineIcon type="chart" />
                  {activeTraining.level}
                </span>
              </div>
              <div className="training-modal-copy">
                {(activeTraining.body || [activeTraining.description]).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        </div>,
        document.body
      ) : null}
      </div>
    </>
  );
}
