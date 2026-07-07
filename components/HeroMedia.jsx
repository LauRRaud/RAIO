import Image from "next/image";

/*
 * Art-directed hero image: a wide landscape crop on desktop, a portrait crop on
 * mobile. Both render into the same absolutely-positioned hero-image container;
 * CSS (heroes.css) shows one per breakpoint. Falls back to the desktop image if
 * no mobile variant is supplied.
 */
export function HeroMedia({ desktop, mobile }) {
  return (
    <>
      <Image
        className="hero-media hero-media-desktop"
        src={desktop}
        alt=""
        fill
        priority
        quality={92}
        sizes="(max-width: 980px) 100vw, 44vw"
      />
      <Image
        className="hero-media hero-media-mobile"
        src={mobile || desktop}
        alt=""
        fill
        priority
        quality={92}
        sizes="100vw"
      />
    </>
  );
}
