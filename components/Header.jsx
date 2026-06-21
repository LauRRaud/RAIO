"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { CartButton } from "@/components/CartButton";
import { getLocalizedPath } from "@/lib/i18n";

const primaryNav = [
  { key: "treeningud", et: "Treeningud", en: "Training", href: "/treeningud" },
  { key: "vahendid", et: "Vahendid", en: "Tools", href: "/vahendid" },
  { key: "sundmused", et: "Sündmused", en: "Events", href: "/sundmused" },
  { key: "pood", et: "Pood", en: "Shop", href: "/pood" },
  { key: "meist", et: "Meist", en: "About", href: "/meist" },
  { key: "journal", et: "RA•IO+", en: "RA•IO+", href: "/journal" }
];

function localizedItems(locale, items) {
  return items.map((item) => ({
    ...item,
    label: locale === "en" ? item.en : item.et,
    href: getLocalizedPath(locale, item.href)
  }));
}

function isActivePath(currentPath, href) {
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function Header({ locale = "et", currentPath = "/" }) {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const frameRef = useRef(null);
  const homeHref = locale === "en" ? "/en" : "/";
  const cartHref = getLocalizedPath(locale, "/ostukorv");
  const etHref = getLocalizedPath("et", currentPath);
  const enHref = getLocalizedPath("en", currentPath);
  const mainItems = localizedItems(locale, primaryNav);
  const mobileItems = localizedItems(locale, primaryNav);

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
        <Link href={homeHref} className="header-logo" aria-label="RA•IO avalehele">
          <img
            className="header-logo-mark"
            src="/Logo/RAIO_horizontal_black_transparent.svg"
            alt="RA•IO"
            width={3073}
            height={805}
            decoding="async"
            fetchPriority="high"
          />
        </Link>

        <nav className="desktop-nav" aria-label={locale === "en" ? "Main navigation" : "Peamenüü"}>
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
          <div className="language-switch" aria-label={locale === "en" ? "Language" : "Keel"}>
            <Link className={locale === "et" ? "is-active" : ""} href={etHref}>
              ET
            </Link>
            <Link className={locale === "en" ? "is-active" : ""} href={enHref}>
              EN
            </Link>
          </div>
          <CartButton
            href={cartHref}
            label={locale === "en" ? "Cart" : "Ostukorv"}
            countLabel={locale === "en" ? "items" : "toodet"}
          />

          <details className="mobile-menu">
            <summary aria-label={locale === "en" ? "Open menu" : "Ava menüü"}>
              <Menu size={22} strokeWidth={1.9} />
            </summary>
            <div className="mobile-menu-panel">
              <nav aria-label={locale === "en" ? "Mobile navigation" : "Mobiilimenüü"}>
                {mobileItems.map((item) => (
                  <Link key={item.key} href={item.href}>
                    {item.label}
                  </Link>
                ))}
                <Link href={etHref}>ET</Link>
                <Link href={enHref}>EN</Link>
                <Link href={cartHref}>{locale === "en" ? "Cart" : "Ostukorv"}</Link>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
