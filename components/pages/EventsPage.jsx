import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EventsCardsCarousel } from "@/components/EventsCardsCarousel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getLocalizedPath } from "@/lib/i18n";
import { getMessagesWithAdminImages } from "@/lib/payloadContent";

export async function EventsPage({ locale = "et" }) {
  const messages = await getMessagesWithAdminImages(locale);
  const t = messages.events;
  const path = (href) => getLocalizedPath(locale, href);
  const aboutHref = path("/meist");
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
        >
          <div className="events-hero-panel">
            <h1 id="events-hero-title">{t.heroTitle}</h1>
            <span className="events-short-rule" aria-hidden="true" />
            <div className="events-hero-text">
              {t.heroText.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <Link href="#lahitulevad" className="events-solid-button">
              {t.heroCta}
            </Link>
          </div>

          <div
            className="events-hero-image"
            style={{ "--hero-image-position": t.heroImagePosition }}
            aria-hidden="true"
          >
            <Image
              src={t.heroImage}
              alt=""
              fill
              priority
              quality={92}
              sizes="(max-width: 980px) 100vw, 80vw"
            />
          </div>
        </section>

        <section
          className="events-upcoming-section"
          id="lahitulevad"
          aria-labelledby="events-upcoming-title"
        >
          <div className="events-section-top">
            <h2 id="events-upcoming-title">{t.upcomingTitle}</h2>
            <Link href={aboutHref} className="events-all-link">
              {t.allLink}
              <ArrowRight size={20} strokeWidth={1.6} aria-hidden="true" />
            </Link>
          </div>

          <EventsCardsCarousel
            events={t.events}
            cta={t.cardCta}
            modalClose={t.modalClose}
            labels={messages.carousel.events}
          />

          <section
            className="events-host-cta"
            aria-labelledby="events-host-title"
          >
            <div className="events-host-image">
              <Image
                src={t.host.image}
                alt={t.host.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
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
