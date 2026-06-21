import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getLocalizedPath } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export function AboutPage({ locale = "et" }) {
  const messages = getMessages(locale);
  const t = messages.about;
  const contactHref = getLocalizedPath(locale, "/kontakt");

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/meist" />

      <main id="main" className="about-page-redesign">
        <section className="about-hero" aria-labelledby="about-hero-title">
          <div className="about-hero-image" aria-hidden="true">
            <Image src={t.heroImage} alt="" fill priority quality={92} sizes="(max-width: 980px) 100vw, 80vw" />
          </div>
          <div className="about-hero-panel">
            <h1 id="about-hero-title">{t.heroTitle}</h1>
            <span className="about-short-rule" aria-hidden="true" />
            <div className="about-hero-text">
              {t.heroText.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <Link href={contactHref} className="about-solid-button">
              {t.cta}
            </Link>
          </div>
        </section>

        <div className="about-content-section">
          <section className="about-story-panel" aria-labelledby="about-story-title">
            <div className="about-story-image">
              <Image
                src={t.storyImage}
                alt={t.storyImageAlt}
                fill
                sizes="(max-width: 980px) 100vw, 46vw"
              />
            </div>
            <div className="about-story-copy">
              <h2 id="about-story-title">{t.storyTitle}</h2>
              {t.story.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>

          <section className="about-closing-panel" aria-labelledby="about-closing-title">
            <div className="about-closing-copy">
              <h2 id="about-closing-title">{t.closingTitle}</h2>
              <div className="about-closing-values" aria-label={t.storyTitle}>
                {t.values.map((value) => (
                  <article key={value.title}>
                    <span>{value.title}</span>
                    <p>{value.text}</p>
                  </article>
                ))}
              </div>
            </div>
            <aside className="about-closing-action" aria-label={t.closingCta}>
              <Link href={contactHref} className="about-solid-button">
                {t.closingCta}
              </Link>
            </aside>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
