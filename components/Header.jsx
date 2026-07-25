"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CartButton } from "@/components/CartButton";
import { getLocalizedPath } from "@/lib/i18n";
import { TextureSlideshowClient } from "@/components/TextureSlideshowClient";

function localizedItems(locale, items) {
  return items.map((item) => ({
    ...item,
    href: getLocalizedPath(locale, item.href)
  }));
}

function isActivePath(currentPath, href) {
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function Header({ locale = "et", currentPath = "/", labels, brandName, textures = null }) {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  /* Mobiilimenüü on ekraanitäis paneel, seega tema olek EI TOHI jääda <details>
     enda DOM-atribuudi hooleks: Next'i kliendinavigatsioon hoiab sama sõlme
     elus ja avatud menüü kataks järgmise lehe ära. Kontrollitud olek + sulgemine
     lingiklõpsul ja teepiste muutumisel. */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const frameRef = useRef(null);
  const t = labels;
  const homeHref = locale === "en" ? "/en" : "/";
  const cartHref = getLocalizedPath(locale, "/ostukorv");
  const etHref = getLocalizedPath("et", currentPath);
  const enHref = getLocalizedPath("en", currentPath);
  const mainItems = localizedItems(locale, t.primaryNav);
  const mobileItems = localizedItems(locale, t.primaryNav);
  const activeLanguage = locale === "en" ? t.languages.en : t.languages.et;
  const alternateLanguageHref = locale === "en" ? etHref : enHref;

  useEffect(() => {
    const showAtTopOffset = 12;
    const hideAfterOffset = 96;
    const scrollDelta = 6;

    lastScrollYRef.current = window.scrollY;
    setIsHeaderHidden(window.scrollY > hideAfterOffset);

    function handleScroll() {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - lastScrollYRef.current;
        const isScrollingDown = currentScrollY > lastScrollYRef.current;
        const isScrollingUp = currentScrollY < lastScrollYRef.current;

        if (currentScrollY <= showAtTopOffset) {
          setIsHeaderHidden(false);
        } else if (isScrollingDown && scrollDifference > scrollDelta && currentScrollY > hideAfterOffset) {
          setIsHeaderHidden(true);
        } else if (isScrollingUp && Math.abs(scrollDifference) > scrollDelta) {
          setIsHeaderHidden(false);
        }

        lastScrollYRef.current = currentScrollY;
        frameRef.current = null;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header className={`site-header${isHeaderHidden ? " is-hidden" : ""}`}>
      {textures?.images?.length ? (
        <TextureSlideshowClient set="beige" images={textures.images} interval={textures.interval} />
      ) : null}
      <div className="header-shell">
        <Link href={homeHref} className="header-logo" aria-label={t.homeLabel}>
          <img
            className="header-logo-mark"
            src="/Logo/RAIO_horizontal_black_transparent.svg"
            alt={brandName}
            width={3073}
            height={805}
            decoding="async"
            fetchPriority="high"
          />
        </Link>

        <nav className="desktop-nav" aria-label={t.desktopNavLabel}>
          {mainItems.map((item) => {
            const isActive = isActivePath(currentPath, item.href);

            return (
              <Link key={item.key} href={item.href} className={isActive ? "is-active" : undefined} aria-current={isActive ? "page" : undefined}>
                {item.label}
                <svg className="nav-mace" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 5 Q 50 7 98 5" />
                </svg>
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <Link className="language-switch-link" href={alternateLanguageHref} aria-label={t.languageLabel}>
            <span>{activeLanguage}</span>
            <ChevronDown size={15} strokeWidth={1.8} aria-hidden="true" />
          </Link>
          <CartButton
            href={cartHref}
            label={t.cartLabel}
            countLabel={t.cartCountLabel}
          />

          <details
            className="mobile-menu"
            open={isMenuOpen}
            onToggle={(event) => setIsMenuOpen(event.currentTarget.open)}
          >
            {/* Kolm kriipsu on CSS-ribad, MITTE lucide <Menu>: SVG teljed (y 6/12/18
                24-viewBox'is) sattusid 27px-le skaleerides murdosalistele
                pikslitele ja iga kriips rasterdus eri paksusega (omanik
                2026-07-25: "hamburgeri kriipsud sama paksud"). Ribad istuvad
                täisarvulistel positsioonidel ja on definitsiooni järgi ühepaksud.
                Ühtlasi kaob eraldi X-ikoon: samad ribad pöörduvad ristiks, nii et
                kinni- ja lahtioleku märk on sama massiga. */}
            <summary aria-label={isMenuOpen ? t.closeMenuLabel : t.openMenuLabel}>
              <span className="menu-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </summary>
            <div className="mobile-menu-panel">
              {textures?.images?.length ? (
                <TextureSlideshowClient set="beige" images={textures.images} interval={textures.interval} />
              ) : null}
              <nav aria-label={t.mobileNavLabel}>
                {mobileItems.map((item) => (
                  <Link key={item.key} href={item.href} onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
                <Link href={cartHref} onClick={() => setIsMenuOpen(false)}>
                  {t.cartLabel}
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
