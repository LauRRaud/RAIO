"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* "Korralda ise" modaal. Sama aken avaneb KAHEST kohast: sündmuste lehe
   bändist ja treeningute lehe töötoa-bändist — mõlemad küsivad sedasama
   ("tellige meilt oma grupile"), aga vastus on üks ja sama, seega üks sisu
   ühes globaalis. Bändi pealkiri ja tekst jäävad lehele omaseks, ainult nupu
   siht on jagatud. buttonClassName sellepärast, et nupustiil on lehe oma
   (.events-solid-button / .training-solid-button).

   Modaali kroom (taust, sulgemisnupp, kerimine) tuleb meelega sündmuse modaali
   klassidest, et kõik modaalid näeksid välja ühesugused; host-modal-* klassid
   katavad ainult seda sisu, mida sündmuse modaalis ei ole (formaadid, sammud,
   "hea teada"). */
/* Aken on jagatav: /sundmused#korralda avab selle kohe ja avatud akna ajal
   seisab see aadress ka aadressiribal, nii et lingi saab lihtsalt kopeerida.
   history.replaceState, mitte pushState — muidu tekiks iga avamine ajalukku
   eraldi sammuna ja "tagasi" nupp klõpsiks läbi modaali avamiste. */
const HASH = "#korralda";

export function HostEventModal({ label, closeLabel, content, contactHref, buttonClassName = "events-solid-button" }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);

  /* Avamine lingilt: nii esmasel laadimisel kui siis, kui keegi kleebib
     aadressi juba avatud lehel (hashchange). */
  useEffect(() => {
    const sync = () => setOpen(window.location.hash === HASH);

    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

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
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        {label}
      </button>

      {open && typeof document !== "undefined" ? createPortal(
        <div
          className="events-event-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
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
        </div>,
        document.body
      ) : null}
    </>
  );
}
