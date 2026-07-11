import Image from "next/image";
import Link from "next/link";
import { EventsCardsCarousel } from "@/components/EventsCardsCarousel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroMedia } from "@/components/HeroMedia";
import { getLocalizedPath } from "@/lib/i18n";
import { getCmsSectionProps, getEventItems, getMessagesWithAdminImages } from "@/lib/payloadContent";

export async function EventsPage({ locale = "et" }) {
  const messages = await getMessagesWithAdminImages(locale);
  const t = messages.events;
  const events = await getEventItems(locale, t.events);
  const path = (href) => getLocalizedPath(locale, href);
  const contactHref = path("/meist#kontakt");

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/sundmused" labels={messages.header} brandName={messages.brand.name} />

      <main id="main" className="events-page-redesign">
        <section
          className="events-hero-redesign"
          aria-labelledby="events-hero-title"
          {...getCmsSectionProps(messages, "eventsHero")}
        >
          <div className="events-hero-panel">
            <h1 id="events-hero-title">{t.heroTitle}</h1>
            <span className="events-short-rule" aria-hidden="true" />
            <div className="events-hero-text">
              {t.heroText.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div
            className="events-hero-image"
            style={{ "--hero-image-position": t.heroImagePosition }}
            aria-hidden="true"
          >
            <HeroMedia desktop={t.heroImage} mobile={t.heroImageMobile} />
          </div>
        </section>

        <section
          className="events-upcoming-section"
          id="lahitulevad"
          aria-labelledby="events-upcoming-title"
        >
          <div className="events-scroll-band" {...getCmsSectionProps(messages, "eventsCarousel")}>
            <EventsCardsCarousel
              events={events}
              cta={t.cardCta}
              modalClose={t.modalClose}
              labels={messages.carousel.events}
              title={t.upcomingTitle}
              titleId="events-upcoming-title"
              allLabel={t.allLink}
            />
          </div>

          <section
            className="events-host-cta"
            aria-labelledby="events-host-title"
            {...getCmsSectionProps(messages, "eventsHost")}
          >
            <div className="events-host-image">
              <Image
                src={t.host.image}
                alt={t.host.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 44vw"
              />
            </div>
            <div className="events-host-copy">
              <h2 id="events-host-title">{t.host.title}</h2>
              <span className="events-short-rule" aria-hidden="true" />
              <p>{t.host.text}</p>
              <Link href={contactHref} className="events-solid-button">
                {t.host.cta}
              </Link>
            </div>
          </section>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
