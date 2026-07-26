"use client";

import { useEffect, useState } from "react";
import variantMap from "@/lib/textureVariants.json";

/* Responsive-taustad ilma next/image'ita: crossfade elab CSS-is, seega <img>
   jääb. srcset EI vähenda kvaliteeti — variandid on sama q60, ainult
   väiksemate mõõtmetega, ja telefon ei suuda 2000 px faili niikuinii kuvada.
   Kaardis puuduv pilt (admini upload, uus foto ilma variante genereerimata)
   renderdub muutumatult ilma srcset'ita. Kaart: scripts/texture-variants.mjs. */
function buildSrcSet(src) {
  const entry = variantMap[src];
  if (!entry) return undefined;

  const { dir, file } = splitPath(src);

  return [
    ...entry.variants.map((w) => `${dir}/w${w}/${file} ${w}w`),
    `${src} ${entry.base}w`
  ].join(", ");
}

function splitPath(src) {
  const slash = src.lastIndexOf("/");
  return { dir: src.slice(0, slash), file: src.slice(slash + 1) };
}

/* Mobiilile PÜSTINE kärbe, mitte sama maastikupilt kitsamana.
   Bänd on telefonis ~390x700 ja `object-fit: cover` mahutab maastikufoto sinna
   KÕRGUSE järgi: 1200x800 fail venitatakse 1050 px laiaks ja 63% kaob servadest.
   Nähtavasse aknasse jõuab siis 446 lähtepikslit, kuigi ekraan nõuab 1170 →
   2.63x ülesskaleerimine (mõõdetud). Püstine 960x1600 kärbe annab samasse
   aknasse ~890 pikslit ehk 1.31x — pool vähem hägu, ilma et ükski piksel läheks
   kärpes raisku. Piir 980px on sama, kust CSS bändid ühte veergu laotab. */
function buildPortrait(src) {
  const entry = variantMap[src];
  if (!entry?.portrait) return undefined;
  const { dir, file } = splitPath(src);
  return `${dir}/p/${file}`;
}

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
          <picture key={src}>
            {buildPortrait(src) ? (
              <source media="(max-width: 980px)" srcSet={buildPortrait(src)} />
            ) : null}
            <img
              src={src}
              srcSet={buildSrcSet(src)}
              /* Töölaual katab taust sektsiooni servast servani, seega laius =
                 vaateava. Mobiili mõõt tuleb <source>'ist ülalpool ja seal on
                 ainult üks fail, nii et sizes teda ei puuduta. */
              sizes="100vw"
              alt=""
              className={`texture-backdrop-img${index === active ? " is-active" : ""}`}
              loading={index === 0 ? "eager" : "lazy"}
              /* Esimene taust on avalehe LCP-element. eager üksi ei tõsta seda
                 brauseri prioriteedijärjekorras — Lighthouse 2026-07-26 nõudis
                 otse fetchpriority="high" (LCP oli 2.6 s, piir 2.5 s). */
              fetchPriority={index === 0 ? "high" : undefined}
              decoding="async"
              draggable={false}
            />
          </picture>
        ) : null
      )}
      <span className="texture-backdrop-tint" />
    </div>
  );
}
