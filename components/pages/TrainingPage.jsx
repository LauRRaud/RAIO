import Image from "next/image";
import Link from "next/link";
import { Heart, Leaf, UserRound, UsersRound } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getHeaderTextures } from "@/lib/payloadContent";
import { HeroMedia } from "@/components/HeroMedia";
import { LineIcon } from "@/components/Icons";
import { TrainingCardsCarousel } from "@/components/TrainingCardsCarousel";
import { getLocalizedPath } from "@/lib/i18n";
import { getCmsSectionProps, getMessagesWithAdminImages, getTrainingItems } from "@/lib/payloadContent";
import { TextureSlideshow } from "@/components/TextureSlideshow";

/* Kõik neli ühest lucide perekonnast, nagu vahendite lehel (omanik 2026-07-20:
   "ikoonid vahendi lehel ilusamad kui treeningu lehel"). "hand" on ajalooline
   võti väikeste gruppide jaoks — käemärk ei tähista gruppi, seega kaardistub
   see inimeste ikoonile. */
const qualityIconComponents = {
  leaf: Leaf,
  hand: UsersRound,
  users: UsersRound,
  user: UserRound,
  heart: Heart
};

export async function TrainingPage({ locale = "et" }) {
  const messages = await getMessagesWithAdminImages(locale);
  const t = messages.training;
  const trainings = await getTrainingItems(locale, t.trainings);
  const path = (href) => getLocalizedPath(locale, href);
  const contactHref = path("/meist#kontakt");

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/treeningud" labels={messages.header} brandName={messages.brand.name} textures={await getHeaderTextures()} />

      <main id="main" className="training-page-redesign">
        <section
          className="training-hero-redesign"
          aria-labelledby="training-hero-title"
          {...getCmsSectionProps(messages, "trainingHero")}
        >
          <TextureSlideshow set="dark" />
          <div className="training-hero-panel">
            <h1 id="training-hero-title">{t.heroTitle}</h1>
            <span className="training-short-rule" aria-hidden="true" />
            <div className="training-hero-text">
              {t.heroText.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div
            className="training-hero-image"
            style={{ "--hero-image-position": t.heroImagePosition }}
            aria-hidden="true"
          >
            <HeroMedia desktop={t.heroImage} mobile={t.heroImageMobile} />
          </div>
        </section>

        <section
          className="training-content-section"
          id="treeningud"
          aria-labelledby="training-list-title"
        >
          <div className="training-scroll-band" {...getCmsSectionProps(messages, "trainingCarousel")}>
            <TextureSlideshow set="green" />
            <TrainingCardsCarousel
              trainings={trainings}
              cta={t.cardCta}
              modalClose={t.modalClose}
              labels={messages.carousel.training}
              title={t.listTitle}
              titleId="training-list-title"
              allLabel={t.allLink}
            />
          </div>

          <section
            className="training-lasting-panel"
            aria-labelledby="training-lasting-title"
            {...getCmsSectionProps(messages, "trainingLasting")}
          >
            <TextureSlideshow set="gray" />
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
              <Link href={path("/meist#treenerid")} className="training-solid-button">
                {t.lasting.cta}
              </Link>
            </div>

            <div className="training-quality-list">
              {t.qualities.map((quality) => {
                const QualityIcon = qualityIconComponents[quality.icon];

                return (
                  <div className="training-quality-item" key={quality.title}>
                    {QualityIcon ? (
                      <QualityIcon
                        className="training-line-icon"
                        strokeWidth={1.35}
                        aria-hidden="true"
                      />
                    ) : (
                      <LineIcon type={quality.icon} />
                    )}
                    <span>{quality.title}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section
            className="training-workshop-panel"
            aria-labelledby="training-workshop-title"
            {...getCmsSectionProps(messages, "trainingWorkshop")}
          >
            <TextureSlideshow set="terracotta" />
            <div className="training-workshop-copy">
              <h2 id="training-workshop-title">{t.workshop.title}</h2>
              <p>{t.workshop.text}</p>
            </div>
            <Link href={contactHref} className="training-solid-button">
              {t.workshop.cta}
            </Link>
          </section>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
