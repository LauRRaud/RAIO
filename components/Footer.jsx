import Link from "next/link";
import { getLocalizedPath } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer({ locale = "et" }) {
  const messages = getMessages(locale);
  const brand = messages.brand;
  const t = messages.footer;
  const header = messages.header;
  const homeHref = locale === "en" ? "/en" : "/";
  const instagramHref = "https://www.instagram.com/ra.ioworld";
  const currentYear = new Date().getFullYear();
  const navItems = (header?.primaryNav || []).map((item) => ({
    ...item,
    href: getLocalizedPath(locale, item.href)
  }));

  return (
    <footer className="footer">
      <div className="footer-shell">
        <Link href={homeHref} className="footer-logo-link" aria-label={brand.name}>
          <img
            className="footer-logo"
            src="/Logo/RAIO_horizontal_black_transparent.svg"
            alt={brand.name}
            width={3073}
            height={805}
            decoding="async"
          />
        </Link>

        <p className="footer-slogan">{t.slogan}</p>

        {navItems.length ? (
          <nav className="footer-nav" aria-label={header.desktopNavLabel}>
            {navItems.map((item) => (
              <Link key={item.key} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <a
          className="footer-social-link"
          href={instagramHref}
          target="_blank"
          rel="noreferrer"
          aria-label={t.instagramLabel}
        >
          <InstagramIcon className="footer-social-icon" aria-hidden="true" />
          <span className="footer-social-handle">ra.ioworld</span>
        </a>

        <p className="footer-fineprint">
          &copy; {currentYear} {"\u00b7"} {brand.company}
        </p>
      </div>
    </footer>
  );
}
