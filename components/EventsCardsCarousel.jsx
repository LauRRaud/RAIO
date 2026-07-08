"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function EventsCardsCarousel({ events, cta, modalClose, labels }) {
  const eventTrackRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    const track = eventTrackRef.current;

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
  }, [events.length]);

  useEffect(() => {
    if (!activeEvent) return undefined;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setActiveEvent(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeEvent]);

  function scrollEvents(direction) {
    const track = eventTrackRef.current;

    if (!track) return;

    const card = track.querySelector(".events-event-card");
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    const distance = card
      ? card.getBoundingClientRect().width + gap
      : track.clientWidth * 0.82;

    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  return (
    <div className="events-event-carousel">
      {canScroll ? (
        <>
          <button
            className="events-event-arrow events-event-arrow-left"
            type="button"
            onClick={() => scrollEvents(-1)}
            aria-label={labels.previous}
          >
            <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button
            className="events-event-arrow events-event-arrow-right"
            type="button"
            onClick={() => scrollEvents(1)}
            aria-label={labels.next}
          >
            <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div className="events-grid-redesign" ref={eventTrackRef}>
        {events.map((event) => (
          <article className="events-event-card" key={event.title}>
            <div className="events-event-image">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 620px) 100vw, 540px"
                style={{ objectPosition: event.imagePosition }}
              />
            </div>
            <div className="events-event-body">
              <p className="events-date">{event.date}</p>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p className="events-location">
                <MapPin size={24} strokeWidth={1.7} aria-hidden="true" />
                {event.location}
              </p>
              <button
                type="button"
                className="events-outline-button"
                onClick={() => setActiveEvent(event)}
                aria-haspopup="dialog"
              >
                {cta}
              </button>
            </div>
          </article>
        ))}
      </div>

      {activeEvent && typeof document !== "undefined" ? createPortal(
        <div
          className="events-event-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveEvent(null);
            }
          }}
        >
          <article
            className="events-event-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="events-event-dialog-title"
          >
            <button
              type="button"
              className="events-event-close"
              onClick={() => setActiveEvent(null)}
              aria-label={modalClose}
              ref={closeButtonRef}
            >
              <X size={24} strokeWidth={1.7} aria-hidden="true" />
            </button>

            <div className="events-event-modal-content">
              <p className="events-date">{activeEvent.date}</p>
              <h2 id="events-event-dialog-title">{activeEvent.title}</h2>
              <p className="events-event-modal-lead">
                {activeEvent.description}
              </p>
              <p className="events-location">
                <MapPin size={17} strokeWidth={1.7} aria-hidden="true" />
                {activeEvent.location}
              </p>
              <div className="events-event-modal-copy">
                {(activeEvent.body || [activeEvent.description]).map((paragraph) => (
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
