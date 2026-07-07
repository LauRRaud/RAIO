"use client";

import { useEffect } from "react";

/*
 * Scroll-linked motion for the home page. Three section behaviours, driven
 * directly by scroll position (works in every browser):
 *   hero — copy drifts up and fades as the page leaves; the framed photo
 *          drifts inside its box
 *   side/rise — copy fades up a short distance as the section enters; the
 *          photo drifts slowly inside its (overflow: hidden) column
 * All image movement happens on the inner img with a slight overscan scale,
 * so the section background is never exposed at the seams. The transforms
 * are inline styles: if this never runs the page just renders static.
 * Disabled on mobile, where sections are a single image with overlaid text.
 */
export function HomeMotion() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(".home-split[data-motion]")).map((sec) => ({
      sec,
      mode: sec.getAttribute("data-motion"),
      txt: sec.querySelector(".home-split-copy"),
      box: sec.querySelector(".home-split-media"),
      img: sec.querySelector(".home-split-media img")
    }));
    if (!sections.length) return undefined;

    const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

    const reset = () => {
      for (const { txt, box, img } of sections) {
        for (const el of [txt, box, img]) {
          if (el) {
            el.style.transform = "";
            el.style.opacity = "";
          }
        }
        if (box) box.style.removeProperty("--reveal");
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let ticking = false;

    const update = () => {
      ticking = false;

      if (window.innerWidth <= 980) {
        reset();
        return;
      }

      const H = window.innerHeight;
      const st = window.scrollY || window.pageYOffset;

      for (const { sec, mode, txt, box, img } of sections) {
        if (!txt || !box) continue;
        const top = sec.offsetTop;
        const h = sec.offsetHeight;

        /* Drift: how far the section centre sits from the viewport centre,
           -1 (below) … 0 (centred) … 1 (above). Drives the slow photo pan. */
        const d = clamp((top + h / 2 - st - H / 2) / (H * 0.9), -1, 1);

        if (mode === "hero") {
          const p = clamp(st / (h * 0.9), 0, 1);
          txt.style.transform = `translateY(${(-p * H * 0.16).toFixed(1)}px)`;
          txt.style.opacity = (1 - p * 0.9).toFixed(2);
          box.style.transform = `translateY(${(-p * H * 0.05).toFixed(1)}px)`;
          box.style.opacity = (1 - p * 0.4).toFixed(2);
          if (img) {
            img.style.transform = `scale(1.12) translateY(${(p * 5).toFixed(2)}%)`;
          }
        } else {
          /* Entry: 0 → 1 while the section scrolls into view. */
          const e = clamp((st + H - top) / (H * 0.75), 0, 1);
          const rest = 1 - e;
          txt.style.transform = `translateY(${(rest * 56).toFixed(1)}px)`;
          txt.style.opacity = clamp(e * 1.35, 0, 1).toFixed(2);
          box.style.transform = "";
          box.style.opacity = "";
          /* Curtain reveal on the framed photo (CSS ::before reads --reveal).
             Eased so it opens briskly and settles softly. */
          const eased = 1 - (1 - e) ** 3;
          if (eased >= 1) {
            box.style.removeProperty("--reveal");
          } else {
            box.style.setProperty("--reveal", eased.toFixed(3));
          }
          if (img) {
            img.style.transform = `scale(1.06) translateY(${(-d * 2.4).toFixed(2)}%)`;
          }
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reset();
    };
  }, []);

  return null;
}
