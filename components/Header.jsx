"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { CartButton } from "@/components/CartButton";
import { getLocalizedPath } from "@/lib/i18n";

function localizedItems(locale, items) {
  return items.map((item) => ({
    ...item,
    href: getLocalizedPath(locale, item.href)
  }));
}

function isActivePath(currentPath, href) {
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function Header({ locale = "et", currentPath = "/", labels, brandName }) {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const frameRef = useRef(null);
  const t = labels;
  const homeHref = locale === "en" ? "/en" : "/";
  const cartHref = getLocalizedPath(locale, "/ostukorv");
  const etHref = getLocalizedPath("et", currentPath);
  const enHref = getLocalizedPath("en", currentPath);
  const mainItems = localizedItems(locale, t.primaryNav);
  const mobileItems = localizedItems(locale, t.primaryNav);

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

  return (
    <header className={`site-header${isHeaderHidden ? " is-hidden" : ""}`}>
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
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <div className="language-switch" aria-label={t.languageLabel}>
            <Link className={locale === "et" ? "is-active" : ""} href={etHref}>
              {t.languages.et}
            </Link>
            <Link className={locale === "en" ? "is-active" : ""} href={enHref}>
              {t.languages.en}
            </Link>
          </div>
          <CartButton
            href={cartHref}
            label={t.cartLabel}
            countLabel={t.cartCountLabel}
          />

          <details className="mobile-menu">
            <summary aria-label={t.openMenuLabel}>
              <Menu size={22} strokeWidth={1.9} />
            </summary>
            <div className="mobile-menu-panel">
              <nav aria-label={t.mobileNavLabel}>
                {mobileItems.map((item) => (
                  <Link key={item.key} href={item.href}>
                    {item.label}
                  </Link>
                ))}
                <Link href={etHref}>{t.languages.et}</Link>
                <Link href={enHref}>{t.languages.en}</Link>
                <Link href={cartHref}>{t.cartLabel}</Link>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
