// Shared arrow/swipe-nav scrolling for the card carousels (events, tools,
// journal, training, shop). The native `scrollTo({ behavior: "smooth" })` is
// short and abrupt; this animates scrollLeft with an ease-in-out curve instead
// (owner 2026-07-10: "kaartide liigutamine võiks sujuvam olla, tunduvalt").

const DURATION_MS = 700;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function cancelAnimation(track) {
  if (track._carouselFrame) {
    cancelAnimationFrame(track._carouselFrame);
    track._carouselFrame = null;
  }
  track.style.scrollSnapType = "";
  track.style.scrollBehavior = "";
}

function animateScrollLeft(track, target) {
  cancelAnimation(track);

  const start = track.scrollLeft;
  const delta = target - start;
  if (Math.abs(delta) < 1) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    track.scrollLeft = target;
    return;
  }

  // Snap + CSS smooth behaviour would fight the frame-by-frame animation;
  // the final value IS a snap point, so nothing shifts when they come back.
  track.style.scrollSnapType = "none";
  track.style.scrollBehavior = "auto";

  // A wheel/touch gesture takes over immediately.
  const interrupt = () => cancelAnimation(track);
  track.addEventListener("wheel", interrupt, { once: true, passive: true });
  track.addEventListener("touchstart", interrupt, { once: true, passive: true });

  const t0 = performance.now();
  const step = (now) => {
    const progress = Math.min(1, (now - t0) / DURATION_MS);
    track.scrollLeft = start + delta * easeInOutCubic(progress);
    if (progress < 1 && track._carouselFrame) {
      track._carouselFrame = requestAnimationFrame(step);
    } else {
      track.removeEventListener("wheel", interrupt);
      track.removeEventListener("touchstart", interrupt);
      cancelAnimation(track);
    }
  };
  track._carouselFrame = requestAnimationFrame(step);
}

/** Scroll the carousel track by whole cards, landing exactly on a card edge. */
export function scrollCarouselByCards(track, direction) {
  if (!track) return;
  const card = track.firstElementChild;
  if (!card) return;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const pitch = card.getBoundingClientRect().width + gap;
  const index = Math.round(track.scrollLeft / pitch);
  const max = track.scrollWidth - track.clientWidth;
  const target = Math.max(0, Math.min((index + direction) * pitch, max));
  animateScrollLeft(track, target);
}
