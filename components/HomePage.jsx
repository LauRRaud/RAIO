import Image from "next/image";
import Link from "next/link";
import { DocumentLang } from "@/components/DocumentLang";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HomeMotion } from "@/components/HomeMotion";
import { getLocalizedPath } from "@/lib/i18n";
import { getCmsSectionProps, getMessagesWithAdminImages } from "@/lib/payloadContent";

function SplitMedia({ src, alt, position, priority = false }) {
  return (
    <div className="home-split-media">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 980px) 100vw, 50vw"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}

export async function HomePage({ locale = "et" }) {
  const messages = await getMessagesWithAdminImages(locale);
  const home = messages.home;
  const { hero, philosophy, tools, categoryWorld } = home;

  return (
    <>
      {locale === "en" ? <DocumentLang lang="en" /> : null}
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/" labels={messages.header} brandName={messages.brand.name} />
      <HomeMotion />
      <main id="main" className="home-page" data-locale={locale}>
        <section className="home-split home-split-hero" data-motion="hero" {...getCmsSectionProps(messages, "homeHero")}>
          <div className="home-split-copy">
            <p className="home-split-eyebrow">{hero.eyebrow}</p>
            <h1 className="home-hero-title">
              {hero.titleStart}
              <em className="home-title-accent">{hero.titleAccent}</em>
            </h1>
            <p className="home-split-lede">{hero.copy}</p>
          </div>
          <SplitMedia src={hero.image} alt={hero.imageAlt} position="50% 38%" priority />
        </section>

        <section className="home-split home-split-philosophy" data-motion="side" {...getCmsSectionProps(messages, "homePhilosophy")}>
          <SplitMedia src={philosophy.image} alt={philosophy.imageAlt} position="48% center" />
          <div className="home-split-copy">
            <p className="home-split-eyebrow">{philosophy.eyebrow}</p>
            <h2 className="home-split-title">
              {philosophy.headingStart} <em className="home-title-accent">{philosophy.headingAccent}</em>
            </h2>
            <p className="home-split-body">{philosophy.body}</p>
          </div>
        </section>

        <section className="home-split home-split-tools" data-motion="rise" {...getCmsSectionProps(messages, "homeTools")}>
          <div className="home-split-copy">
            <p className="home-split-eyebrow">{tools.eyebrow}</p>
            <h2 className="home-split-title">
              {tools.headingStart} <em className="home-title-accent">{tools.headingAccent}</em>
            </h2>
            <p className="home-split-body">{tools.copy}</p>
          </div>
          <SplitMedia src={tools.image} alt={tools.imageAlt} position="50% 42%" />
        </section>

        <section className="home-world" aria-label={categoryWorld.ariaLabel} {...getCmsSectionProps(messages, "homeCards")}>
          {categoryWorld.cards.map((card) => (
            <Link
              key={card.key}
              href={getLocalizedPath(locale, card.path)}
              className={`home-world-card${card.variant ? ` home-world-card-${card.variant}` : ""}`}
            >
              <span className="home-world-media">
                <Image src={card.image} alt={card.alt} fill sizes="(max-width: 980px) 100vw, 20vw" />
              </span>
              <span className="home-world-overlay" />
              <span className="home-world-content">
                <strong>{card.title}</strong>
                <span className="home-world-sub">{card.subtitle}</span>
              </span>
            </Link>
          ))}
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
