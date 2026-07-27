"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import { youtubeId } from "@/lib/youtube";

/* Pildipesa, mis muutub videoks, kui admin'is on YouTube'i link. Kasutusel
   nii lehtede raamitud bändides (kestev treening, miks puu ja kivi, korralda
   oma sündmus, meie lugu) kui karussellimodaalides (treening, sündmus, lugu).

   MIKS FACADE, MITTE KOHE IFRAME: YouTube'i upstuk tõmbab ~800 kB skripte ja
   seab küpsised juba enne, kui keegi vajutanud on. Eelvaatena on lehe enda
   pilt — juba kujundatud, juba optimeeritud — ja iframe tekib alles klõpsu
   peale. Nii ei muutu lehe kiirus videote lisamisest.

   nocookie-domeen: YouTube ei sea jälgimisküpsist enne mängima hakkamist. */
export function BandMedia({ video, image, alt, sizes, playLabel, priority = false }) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(video);

  if (!id) {
    return <Image src={image} alt={alt} fill loading={priority ? "eager" : "lazy"} sizes={sizes} />;
  }

  if (playing) {
    return (
      <iframe
        className="band-video-frame"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
        title={alt || playLabel}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="band-video-poster"
      onClick={() => setPlaying(true)}
      aria-label={playLabel}
    >
      <Image src={image} alt={alt} fill loading={priority ? "eager" : "lazy"} sizes={sizes} />
      <span className="band-video-play" aria-hidden="true">
        <Play size={30} strokeWidth={1.5} />
      </span>
    </button>
  );
}
