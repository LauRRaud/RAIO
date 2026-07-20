"use client";

import { useEffect, useState } from "react";

/* Kliendipool: roteerib serverist saadud pilte crossfade'iga. Ühe pildiga
   kaust = staatiline taust, vahetumist ei toimu. */
export function TextureSlideshowClient({ set, images, interval = 20000 }) {
  const [active, setActive] = useState(0);
  /* Ainult aktiivne + järgmine pilt saavad DOM-i, et bänd ei laadiks kogu
     kausta korraga; iga vahetus lükkab akent edasi. */
  const [loadedCount, setLoadedCount] = useState(2);

  useEffect(() => {
    if (images.length < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    /* Väike juhuslik nihe, et kõrvuti bändid ei vahetuks ühes taktis. */
    const tick = interval + Math.random() * 4000;
    const id = setInterval(() => {
      setActive((current) => {
        const next = (current + 1) % images.length;
        setLoadedCount((count) => Math.min(images.length, Math.max(count, next + 2)));
        return next;
      });
    }, tick);
    return () => clearInterval(id);
  }, [images.length, interval]);

  if (!images.length) return null;

  return (
    <div className={`texture-backdrop texture-backdrop--${set}`} aria-hidden="true">
      {images.map((src, index) =>
        /* src-ita <img> renderdaks Chrome'is katkise pildi ikooni — jäta
           mountimata, kuni laadimisaken temani jõuab. Järgmine pilt on alati
           ees laetud, nii et is-active vahetus saab opacity-transitioni. */
        index < loadedCount ? (
          <img
            key={src}
            src={src}
            alt=""
            className={`texture-backdrop-img${index === active ? " is-active" : ""}`}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />
        ) : null
      )}
      <span className="texture-backdrop-tint" />
    </div>
  );
}
