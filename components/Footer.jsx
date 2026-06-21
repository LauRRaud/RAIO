import Link from "next/link";
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
  const homeHref = locale === "en" ? "/en" : "/";
  const instagramHref = "https://www.instagram.com/raio33movement/";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-shell">
        <Link href={homeHref} className="footer-logo-link" aria-label={brand.name}>
          <img
            className="footer-logo"
            src="/Logo/RAIO_horizontal_white_transparent.svg"
            alt={brand.name}
            width={3073}
            height={805}
            decoding="async"
          />
        </Link>

        <p className="footer-slogan">{t.slogan}</p>

        <a
          className="footer-social-link"
          href={instagramHref}
          target="_blank"
          rel="noreferrer"
          aria-label={`${t.socialLabel}: Instagram`}
        >
          <InstagramIcon className="footer-social-icon" aria-hidden="true" />
        </a>

        <p className="footer-fineprint">
          &copy; {currentYear} {"\u00b7"} {brand.company}
        </p>
      </div>
    </footer>
  );
}
