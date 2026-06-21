import Image from "next/image";
import Link from "next/link";
import { DocumentLang } from "@/components/DocumentLang";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getLocalizedPath } from "@/lib/i18n";
import { getHomeMessages } from "@/lib/messages";

export function HomePage({ locale = "et" }) {
  const messages = getHomeMessages(locale);

  return (
    <>
      {locale === "en" ? <DocumentLang lang="en" /> : null}
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/" />
      <main id="main" className="lookbook-home" data-locale={locale}>
        <section className="lookbook-hero">
          <Image
            className="lookbook-hero-image"
            src={messages.hero.image}
            alt={messages.hero.imageAlt}
            fill
            priority
            sizes="100vw"
          />
          <div className="lookbook-hero-overlay" />
          <div className="lookbook-hero-content">
            <h1 className="lookbook-hero-logo">
              <Image
                src="/Logo/RAIO_horizontal_white_transparent.svg"
                alt="RA•IO"
                width={3073}
                height={805}
                priority
              />
            </h1>
            <p className="lookbook-hero-title">{messages.hero.title}</p>
            <p className="lookbook-hero-copy">{messages.hero.copy}</p>
          </div>
          <div className="hero-scroll-cue" aria-hidden="true">
            <span aria-hidden="true" />
          </div>
        </section>

        <section className="philosophy-section">
          <div className="philosophy-copy">
            <h2>{messages.philosophy.heading}</h2>
            <p>{messages.philosophy.body}</p>
            <Link href={getLocalizedPath(locale, messages.philosophy.aboutPath)} className="text-link">
              {messages.philosophy.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="philosophy-image">
            <Image
              src={messages.philosophy.image}
              alt={messages.philosophy.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </section>

        <section className="category-world" aria-label={messages.categoryWorld.ariaLabel}>
          {messages.categoryWorld.cards.map((card) => (
            <Link
              key={card.key}
              href={getLocalizedPath(locale, card.path)}
              className={`world-card${card.variant ? ` world-card-${card.variant}` : ""}`}
            >
              <span className="world-card-media" style={{ position: "absolute" }}>
                <Image src={card.image} alt={card.alt} fill sizes="(max-width: 900px) 100vw, 20vw" />
              </span>
              <span className="world-card-overlay" />
              <span className="world-card-content">
                <strong>{card.title}</strong>
                <span className="world-card-arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          ))}
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
