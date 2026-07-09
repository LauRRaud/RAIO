"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LineIcon } from "@/components/Icons";

export function TrainingCardsCarousel({
  trainings,
  cta,
  modalClose,
  labels,
}) {
  const trainingTrackRef = useRef(null);
  const closeButtonRef = useRef(null);
  const touchStartX = useRef(null);
  const [activeTraining, setActiveTraining] = useState(null);

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

  const totalPages = Math.ceil(trainings.length / itemsPerPage);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

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

  function changePage(direction) {
    if (totalPages <= 1) return;

    let newPage = currentPage + direction;
    if (newPage >= totalPages) newPage = 0;
    if (newPage < 0) newPage = totalPages - 1;

    setCurrentPage(newPage);
  }

  const visibleTrainings = trainings.slice(
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
    <div className="training-card-carousel">
      {totalPages > 1 ? (
        <>
          <button
            className="training-card-arrow training-card-arrow-left"
            type="button"
            onClick={() => changePage(-1)}
            aria-label={labels.previous}
          >
            <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button
            className="training-card-arrow training-card-arrow-right"
            type="button"
            onClick={() => changePage(1)}
            aria-label={labels.next}
          >
            <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div className="training-card-grid" ref={trainingTrackRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {visibleTrainings.map((training) => (
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
  );
}
