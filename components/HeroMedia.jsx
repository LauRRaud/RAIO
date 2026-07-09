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
      {/* Each variant is display:none on the other breakpoint, so its `sizes`
          drops to 1px there — the hidden image fetches only the smallest
          candidate instead of a full-size file (and Next.js stops warning that
          a "100vw" image isn't rendered at viewport width). */}
      <Image
        className="hero-media hero-media-desktop"
        src={desktop}
        alt=""
        fill
        priority
        quality={92}
        sizes="(max-width: 980px) 1px, 44vw"
      />
      <Image
        className="hero-media hero-media-mobile"
        src={mobile || desktop}
        alt=""
        fill
        priority
        quality={92}
        sizes="(max-width: 980px) 100vw, 1px"
      />
    </>
  );
}
