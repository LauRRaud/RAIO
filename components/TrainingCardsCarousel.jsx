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
  const [canScroll, setCanScroll] = useState(false);
  const [activeTraining, setActiveTraining] = useState(null);

  useEffect(() => {
    const track = trainingTrackRef.current;

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
  }, [trainings.length]);

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

  function scrollTrainings(direction) {
    const track = trainingTrackRef.current;

    if (!track) return;

    const card = track.querySelector(".training-card");
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    const distance = card
      ? card.getBoundingClientRect().width + gap
      : track.clientWidth * 0.82;

    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  return (
    <div className="training-card-carousel">
      {canScroll ? (
        <>
          <button
            className="training-card-arrow training-card-arrow-left"
            type="button"
            onClick={() => scrollTrainings(-1)}
            aria-label={labels.previous}
          >
            <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button
            className="training-card-arrow training-card-arrow-right"
            type="button"
            onClick={() => scrollTrainings(1)}
            aria-label={labels.next}
          >
            <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div className="training-card-grid" ref={trainingTrackRef}>
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
