"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* "Korralda ise" aken. Avaneb KAHEST kohast: sündmuste lehe bändist ja
   treeningute lehe töötoa-bändist — mõlemad küsivad sedasama, seega sisu on
   üks ja elab ühes globaalis.

   MIKS KAHEKS JAGATUD (nupp eraldi aknast):
   1. Aken RENDERDATAKSE ALATI, ka suletuna, ja peidetakse `hidden`-iga.
      Varem oli see createPortal'is ja tekkis alles klõpsu peale — portal ei
      renderdu serveris üldse, seega Google nägi lehel bändi pealkirja ja üht
      lauset, mitte formaate, protsessi ega hindu. Nüüd on kogu tekst lehe
      märgistuses ja indekseeritav; kasutaja jaoks ei muutu midagi.
   2. Aken käib lehe LÕPPU, mitte bändi sisse. Portaalist väljas päriks ta
      bändi reeglid (.events-host-copy p jms) — lehe lõpus ei päri midagi.

   Kaks komponenti räägivad omavahel aknasündmuse kaudu, mitte contexti kaudu:
   nii ei pea kumbki lehekomponent olema kliendikomponent. */
const HASH = "#korralda";
const OPEN_EVENT = "raio:host-event-open";

export function HostEventModalTrigger({ label, buttonClassName = "events-solid-button" }) {
  return (
    <button
      type="button"
      className={buttonClassName}
      aria-haspopup="dialog"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT))}
    >
      {label}
    </button>
  );
}

export function HostEventModalDialog({ closeLabel, content, contactHref }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);

  /* Avamine lingilt (/sundmused#korralda) ja nupult. hashchange katab ka
     juhu, kus keegi kleebib aadressi juba avatud lehel. */
  useEffect(() => {
    const sync = () => setOpen(window.location.hash === HASH);
    const openNow = () => setOpen(true);

    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener(OPEN_EVENT, openNow);

    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener(OPEN_EVENT, openNow);
    };
  }, []);

  /* Avatud aken seisab aadressiribal, nii et lingi saab kopeerida.
     replaceState, mitte pushState — muidu täituks ajalugu avamistest. */
  useEffect(() => {
    const { pathname, search, hash } = window.location;

    if (open && hash !== HASH) window.history.replaceState(null, "", `${pathname}${search}${HASH}`);
    if (!open && hash === HASH) window.history.replaceState(null, "", `${pathname}${search}`);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div
      className="events-event-modal host-event-modal"
      hidden={!open}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <article
        className="events-event-dialog host-event-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="host-event-dialog-title"
      >
        <button
          type="button"
          className="events-event-close"
          onClick={() => setOpen(false)}
          aria-label={closeLabel}
          ref={closeButtonRef}
        >
          <X size={24} strokeWidth={1.7} aria-hidden="true" />
        </button>

        <div className="events-event-modal-content">
          <h2 id="host-event-dialog-title">{content.heroTitle}</h2>
          <div className="host-modal-lead">
            {content.heroText.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <section className="host-modal-block" aria-labelledby="host-modal-formats">
            <h3 id="host-modal-formats">{content.formatsTitle}</h3>
            <ul className="host-modal-formats">
              {content.formats.map((item) => (
                <li key={item.title}>
                  <h4>{item.title}</h4>
                  {/* Kestus · grupp · hind. Omanik täidab admin'is; tühjana
                      rida puudub, et leht ei lubaks numbrit, mida ei ole. */}
                  {item.meta ? <p className="host-modal-format-meta">{item.meta}</p> : null}
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="host-modal-block" aria-labelledby="host-modal-process">
            <h3 id="host-modal-process">{content.processTitle}</h3>
            <ol className="host-modal-steps">
              {content.steps.map((step, index) => (
                <li key={step.title}>
                  <span className="host-modal-step-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="host-modal-block host-modal-notes" aria-labelledby="host-modal-notes">
            <h3 id="host-modal-notes">{content.notesTitle}</h3>
            <ul>
              {content.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>

          <div className="host-modal-closing">
            <h3>{content.closingTitle}</h3>
            <p>{content.closingText}</p>
            <a className="events-solid-button host-modal-contact" href={contactHref}>
              {content.closingCta}
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
