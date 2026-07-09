import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroMedia } from "@/components/HeroMedia";
import { JournalCardsCarousel } from "@/components/JournalCardsCarousel";
import { getJournalArticles, getMessagesWithAdminImages } from "@/lib/payloadContent";

export async function JournalPage({ locale = "et" }) {
  const messages = await getMessagesWithAdminImages(locale);
  const t = messages.journal;
  const articles = await getJournalArticles(locale, t.articles);
  const emailHref = `mailto:${messages.brand.email}`;

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/journal" labels={messages.header} brandName={messages.brand.name} />

      <main id="main" className="journal-page-redesign">
        <section
          className="journal-hero-redesign"
          aria-labelledby="journal-hero-title"
        >
          <div className="journal-hero-panel">
            <h1 id="journal-hero-title">{t.heroTitle}</h1>
            <span className="journal-short-rule" aria-hidden="true" />
            <div className="journal-hero-text">
              {t.heroText.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="journal-hero-image" aria-hidden="true">
            <HeroMedia desktop={t.heroImage} mobile={t.heroImageMobile} />
          </div>
        </section>

        <section
          className="journal-stories-section"
          id="lood"
          aria-labelledby="journal-stories-title"
        >
          <div className="journal-scroll-band">
            <div className="journal-section-top">
              <h2 id="journal-stories-title">{t.storiesTitle}</h2>
              <div
                className="journal-category-row"
                aria-label={t.categoryNavLabel}
              >
                {t.categories.map((category, index) => (
                  <button
                    className={index === 0 ? "is-active" : undefined}
                    type="button"
                    key={category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <JournalCardsCarousel
              articles={articles}
              readMore={t.readMore}
              modalClose={t.modalClose}
              labels={messages.carousel.journal}
            />
          </div>

          <section
            className="journal-signup-banner"
            aria-labelledby="journal-signup-title"
          >
            <div className="journal-signup-copy">
              <h2 id="journal-signup-title">{t.signup.title}</h2>
              <p>{t.signup.text}</p>
              <a href={emailHref} className="journal-solid-button">
                {t.signup.cta}
              </a>
            </div>
            <div className="journal-signup-image" aria-hidden="true">
              <Image
                src={t.signupImage || "/Pictures/Journal/RAIO MEIST1.png"}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 44vw"
              />
            </div>
          </section>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
