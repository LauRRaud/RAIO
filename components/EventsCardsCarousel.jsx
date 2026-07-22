"use client";

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { scrollCarouselByCards } from "@/lib/carouselScroll";

export function EventsCardsCarousel({ events, cta, modalClose, labels, title, titleId, allLabel, registerLabel, statusLabels, registerFallbackHref }) {
  const eventTrackRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const update = () => setItemsPerPage(window.innerWidth <= 620 ? 1 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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

  function scrollByCards(direction) {
    scrollCarouselByCards(eventTrackRef.current, direction);
  }

  const showArrows = !showAll && events.length > itemsPerPage;
  /* Link jääb püsima ka avatud vaates ja kerib tagasi karusselli
     (omanik 2026-07-20: "vaata kõiki kaob ära, ei saa keritava menüü peale
     tagasi"). */
  const canExpand = events.length > itemsPerPage;

  return (
    <>
      {title ? (
        <div className="events-section-top">
          <h2 id={titleId}>{title}</h2>
          {canExpand ? (
            <button
              type="button"
              className="events-all-link"
              onClick={() => setShowAll((open) => !open)}
            >
              {showAll ? labels.showLess : allLabel}
              <ArrowRight size={20} strokeWidth={1.6} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="events-event-carousel">
        {showArrows ? (
          <>
            <button
              className="events-event-arrow events-event-arrow-left"
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label={labels.previous}
            >
              <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
            </button>
            <button
              className="events-event-arrow events-event-arrow-right"
              type="button"
              onClick={() => scrollByCards(1)}
              aria-label={labels.next}
            >
              <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
            </button>
          </>
        ) : null}

        <div
          className={`events-grid-redesign ${showAll ? "is-expanded" : ""}`}
          ref={eventTrackRef}
        >
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
              {(activeEvent.ctaUrl || registerFallbackHref) &&
              (activeEvent.registrationStatus || "open") === "open" ? (
                <a
                  className="events-solid-button events-event-register"
                  href={activeEvent.ctaUrl || registerFallbackHref}
                  {...(activeEvent.ctaUrl ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {registerLabel}
                </a>
              ) : null}
              {statusLabels?.[activeEvent.registrationStatus] ? (
                <p className="events-event-status">{statusLabels[activeEvent.registrationStatus]}</p>
              ) : null}
            </div>
          </article>
        </div>,
        document.body
      ) : null}
      </div>
    </>
  );
}
