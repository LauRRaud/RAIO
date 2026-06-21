import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getLocalizedPath } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export function JournalPage({ locale = "et" }) {
  const messages = getMessages(locale);
  const t = messages.journal;
  const path = (href) => getLocalizedPath(locale, href);

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/journal" />

      <main id="main" className="journal-page-redesign">
        <section className="journal-hero-redesign" aria-labelledby="journal-hero-title">
          <div className="journal-hero-panel">
            <h1 id="journal-hero-title">{t.heroTitle}</h1>
            <span className="journal-short-rule" aria-hidden="true" />
            <div className="journal-hero-text">
              {t.heroText.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <Link href="#lood" className="journal-solid-button">
              {t.heroCta}
            </Link>
          </div>

          <div className="journal-hero-image" aria-hidden="true">
            <Image src={t.heroImage} alt="" fill priority quality={92} sizes="(max-width: 980px) 100vw, 80vw" />
          </div>
        </section>

        <section className="journal-stories-section" id="lood" aria-labelledby="journal-stories-title">
          <div className="journal-section-top">
            <h2 id="journal-stories-title">{t.storiesTitle}</h2>
            <div className="journal-category-row" aria-label={t.categoryNavLabel}>
              <span>{t.categoriesLabel}</span>
              {t.categories.map((category, index) => (
                <button className={index === 0 ? "is-active" : undefined} type="button" key={category}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="journal-card-grid">
            {t.articles.map((article) => (
              <article className="journal-story-card" key={article.title}>
                <div className="journal-story-image">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </div>
                <div className="journal-story-body">
                  <p className="journal-story-meta">
                    {article.date}
                    <span aria-hidden="true">-</span>
                    {article.category}
                  </p>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <Link href={path("/journal")} className="journal-text-link">
                    {t.readMore}
                    <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <section className="journal-signup-banner" aria-labelledby="journal-signup-title">
            <div className="journal-signup-copy">
              <h2 id="journal-signup-title">{t.signup.title}</h2>
              <p>{t.signup.text}</p>
              <Link href={path("/kontakt")} className="journal-solid-button">
                {t.signup.cta}
              </Link>
            </div>
            <div className="journal-signup-image" aria-hidden="true">
              <Image
                src="/Pictures/Journal/RAIO MEIST1.png"
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
          </section>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
