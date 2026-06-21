import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LineIcon } from "@/components/Icons";
import { getLocalizedPath } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export function TrainingPage({ locale = "et" }) {
  const messages = getMessages(locale);
  const t = messages.training;
  const path = (href) => getLocalizedPath(locale, href);

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/treeningud" />

      <main id="main" className="training-page-redesign">
        <section className="training-hero-redesign" aria-labelledby="training-hero-title">
          <div className="training-hero-panel">
            <h1 id="training-hero-title">{t.heroTitle}</h1>
            <span className="training-short-rule" aria-hidden="true" />
            <div className="training-hero-text">
              {t.heroText.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <Link href="#treeningud" className="training-solid-button">
              {t.heroCta}
            </Link>
          </div>

          <div className="training-hero-image" aria-hidden="true">
            <Image src={t.heroImage} alt="" fill priority quality={92} sizes="(max-width: 980px) 100vw, 80vw" />
          </div>
        </section>

        <section className="training-content-section" id="treeningud" aria-labelledby="training-list-title">
          <div className="training-section-intro">
            <h2 id="training-list-title">{t.listTitle}</h2>
            <p>{t.listIntro}</p>
          </div>

          <div className="training-card-grid">
            {t.trainings.map((training) => (
              <article className="training-card" key={training.title}>
                <div className="training-card-image">
                  <Image
                    src={training.image}
                    alt={training.title}
                    fill
                    loading="eager"
                    sizes="(max-width: 900px) 100vw, 25vw"
                  />
                </div>
                <div className="training-card-body">
                  <h3>{training.title}</h3>
                  <p>{training.description}</p>
                  <div className="training-meta">
                    <span>
                      <LineIcon type="clock" />
                      {training.duration}
                    </span>
                    <span>
                      <LineIcon type="chart" />
                      {training.level}
                    </span>
                  </div>
                  <Link href={path("/kontakt")} className="training-text-link">
                    {t.cardCta}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <section className="training-lasting-panel" aria-labelledby="training-lasting-title">
            <div className="training-lasting-image">
              <Image
                src={t.lasting.image}
                alt={t.lasting.imageAlt}
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 42vw"
              />
            </div>

            <div className="training-lasting-copy">
              <h2 id="training-lasting-title">{t.lasting.title}</h2>
              <p>{t.lasting.text}</p>
              <Link href={path("/meist")} className="training-solid-button">
                {t.lasting.cta}
              </Link>
            </div>

            <div className="training-quality-list">
              {t.qualities.map((quality) => (
                <div className="training-quality-item" key={quality.title}>
                  <LineIcon type={quality.icon} />
                  <span>{quality.title}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="training-workshop-panel" aria-labelledby="training-workshop-title">
            <div className="training-workshop-copy">
              <h2 id="training-workshop-title">{t.workshop.title}</h2>
              <p>{t.workshop.text}</p>
            </div>
            <Link href={path("/kontakt")} className="training-solid-button">
              {t.workshop.cta}
            </Link>
          </section>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
