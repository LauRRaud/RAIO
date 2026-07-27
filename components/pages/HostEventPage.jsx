import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroMedia } from "@/components/HeroMedia";
import { SteppedTitle } from "@/components/SteppedTitle";
import { TextureSlideshow } from "@/components/TextureSlideshow";
import { getLocalizedPath } from "@/lib/i18n";
import { getCmsSectionProps, getHeaderTextures, getMessagesWithAdminImages } from "@/lib/payloadContent";

/* "Korralda oma sündmus" — sündmuste lehe bändi taga olev alaleht.
   Kasutab meelega sündmuste lehe klasse (.events-page-redesign, hero, nupud),
   et tüpograafia, värvid ja hero-reeglid (components/headings.css,
   hero-polish.css) kehtiksid siin täpselt samamoodi. Uued .host-* klassid on
   ainult nende plokkide jaoks, mida sündmuste lehel ei ole. */
export async function HostEventPage({ locale = "et" }) {
  const messages = await getMessagesWithAdminImages(locale);
  const t = messages.hostEvent;
  const contactHref = getLocalizedPath(locale, "/meist#kontakt");

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header
        locale={locale}
        currentPath="/sundmused"
        labels={messages.header}
        brandName={messages.brand.name}
        textures={await getHeaderTextures()}
      />

      <main id="main" className="events-page-redesign host-event-page">
        <section
          className="events-hero-redesign"
          aria-labelledby="host-hero-title"
          {...getCmsSectionProps(messages, "hostEventHero")}
        >
          <TextureSlideshow set="dark" />
          <div className="events-hero-panel">
            <h1 id="host-hero-title">
              <SteppedTitle text={t.heroTitle} />
            </h1>
            <span className="events-short-rule" aria-hidden="true" />
            <div className="events-hero-text">
              {t.heroText.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="events-hero-image" aria-hidden="true">
            <HeroMedia desktop={t.heroImage} mobile={t.heroImageMobile} />
          </div>
        </section>

        <section
          className="host-band"
          aria-labelledby="host-formats-title"
          {...getCmsSectionProps(messages, "hostEventFormats")}
        >
          <TextureSlideshow set="light" />
          <div className="host-band-inner">
            <h2 id="host-formats-title">{t.formatsTitle}</h2>
            <ul className="host-formats">
              {t.formats.map((item) => (
                <li key={item.title} className="host-format">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="host-band host-process-band"
          aria-labelledby="host-process-title"
          {...getCmsSectionProps(messages, "hostEventProcess")}
        >
          <TextureSlideshow set="green" />
          <div className="host-band-inner">
            <h2 id="host-process-title">{t.processTitle}</h2>
            <ol className="host-steps">
              {t.steps.map((step, index) => (
                <li key={step.title} className="host-step">
                  <span className="host-step-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>

            <div className="host-notes">
              <h3>{t.notesTitle}</h3>
              <ul>
                {t.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="host-closing"
          aria-labelledby="host-closing-title"
          {...getCmsSectionProps(messages, "hostEventClosing")}
        >
          <TextureSlideshow set="terracotta" />
          <div className="host-closing-copy">
            <h2 id="host-closing-title">{t.closingTitle}</h2>
            <span className="events-short-rule" aria-hidden="true" />
            <p>{t.closingText}</p>
            <Link href={contactHref} className="events-solid-button">
              {t.closingCta}
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
