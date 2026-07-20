import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getHeaderTextures } from "@/lib/payloadContent";
import { HeroMedia } from "@/components/HeroMedia";
import { JournalCardsCarousel } from "@/components/JournalCardsCarousel";
import { getCmsSectionProps, getJournalArticles, getMessagesWithAdminImages } from "@/lib/payloadContent";
import { TextureSlideshow } from "@/components/TextureSlideshow";

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
      <Header locale={locale} currentPath="/journal" labels={messages.header} brandName={messages.brand.name} textures={await getHeaderTextures()} />

      <main id="main" className="journal-page-redesign">
        <section
          className="journal-hero-redesign"
          aria-labelledby="journal-hero-title"
          {...getCmsSectionProps(messages, "journalHero")}
        >
          <TextureSlideshow set="dark" />
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
          <div className="journal-scroll-band" {...getCmsSectionProps(messages, "journalCarousel")}>
            <TextureSlideshow set="green" />
            <JournalCardsCarousel
              articles={articles}
              readMore={t.readMore}
              modalClose={t.modalClose}
              labels={messages.carousel.journal}
              title={t.storiesTitle}
              titleId="journal-stories-title"
              allLabel={t.allLink}
              categories={t.categories}
              categoryNavLabel={t.categoryNavLabel}
            />
          </div>

          <section
            className="journal-signup-banner"
            aria-labelledby="journal-signup-title"
            {...getCmsSectionProps(messages, "journalSignup")}
          >
            <TextureSlideshow set="terracotta" />
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
