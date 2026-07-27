import { SteppedTitle } from "@/components/SteppedTitle";
import Link from "next/link";
import { Heart, Leaf, UserRound, UsersRound } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getHeaderTextures } from "@/lib/payloadContent";
import { HeroMedia } from "@/components/HeroMedia";
import { HostEventModalDialog, HostEventModalTrigger } from "@/components/HostEventModal";
import { BandMedia } from "@/components/BandMedia";
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
            <h1 id="training-hero-title"><SteppedTitle text={t.heroTitle} /></h1>
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
              registerLabel={t.register}
              registerHref={contactHref}
              playLabel={messages.video.play}
            />
          </div>

          <section
            className="training-lasting-panel"
            aria-labelledby="training-lasting-title"
            {...getCmsSectionProps(messages, "trainingLasting")}
          >
            <TextureSlideshow set="gray" />
            <div className="training-lasting-image">
              <BandMedia
                video={t.lasting.video}
                image={t.lasting.image}
                alt={t.lasting.imageAlt}
                sizes="(max-width: 900px) 100vw, 42vw"
                playLabel={messages.video.play}
                priority
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
            {/* Sama modaal, mis sündmuste lehel: küsimus on sama ("tellige
                meilt oma grupile"), seega ei kirjuta me vastust kaks korda. */}
            <HostEventModalTrigger label={t.workshop.cta} buttonClassName="training-solid-button" />
          </section>
        </section>
      </main>

      {/* Aken on <main> VÄLJAS meelega. Sees olles tabaks teda lehe juurklassi
          kehateksti reegel (:is(.events-page-redesign, ...) p), mis muutis
          modaali tüpograafiat — portaalis olles pääses ta sellest. Siin on ta
          serveripoolses HTML-is (Google näeb) ega päri lehe reegleid. */}
      <HostEventModalDialog
        closeLabel={messages.hostEvent.close}
        content={messages.hostEvent}
        contactHref={contactHref}
      />
      <Footer locale={locale} />
    </>
  );
}
