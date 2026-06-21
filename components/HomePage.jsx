import Image from "next/image";
import Link from "next/link";
import { DocumentLang } from "@/components/DocumentLang";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getLocalizedPath } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export function HomePage({ locale = "et" }) {
  const messages = getMessages(locale);
  const home = messages.home;

  return (
    <>
      {locale === "en" ? <DocumentLang lang="en" /> : null}
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/" labels={messages.header} brandName={messages.brand.name} />
      <main id="main" className="lookbook-home" data-locale={locale}>
        <section className="lookbook-hero">
          <Image
            className="lookbook-hero-image"
            src={home.hero.image}
            alt={home.hero.imageAlt}
            fill
            priority
            sizes="100vw"
          />
          <div className="lookbook-hero-overlay" />
          <div className="lookbook-hero-content">
            <h1 className="lookbook-hero-logo">
              <Image
                src="/Logo/RAIO_horizontal_white_transparent.svg"
                alt={messages.brand.name}
                width={3073}
                height={805}
                priority
              />
            </h1>
            <p className="lookbook-hero-title">{home.hero.title}</p>
            <p className="lookbook-hero-copy">{home.hero.copy}</p>
          </div>
          <div className="hero-scroll-cue" aria-hidden="true">
            <span aria-hidden="true" />
          </div>
        </section>

        <section className="philosophy-section">
          <div className="philosophy-copy">
            <h2>{home.philosophy.heading}</h2>
            <p>{home.philosophy.body}</p>
          </div>
          <div className="philosophy-image">
            <Image
              src={home.philosophy.image}
              alt={home.philosophy.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </section>

        <section className="category-world" aria-label={home.categoryWorld.ariaLabel}>
          {home.categoryWorld.cards.map((card) => (
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
