import { SteppedTitle } from "@/components/SteppedTitle";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getHeaderTextures } from "@/lib/payloadContent";
import { getCmsSectionProps, getMessagesWithAdminImages } from "@/lib/payloadContent";
import { TextureSlideshow } from "@/components/TextureSlideshow";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export async function AboutPage({ locale = "et" }) {
  const messages = await getMessagesWithAdminImages(locale);
  const t = messages.about;
  const emailHref = `mailto:${messages.brand.email}`;
  const instagramHref = "https://www.instagram.com/ra.ioworld";
  const instagramHandle = instagramHref.replace(/\/+$/, "").split("/").pop();
  const contactLabels = t.contactPanel;
  const contactItems = [
    { label: contactLabels.company, value: messages.brand.company },
    { label: contactLabels.registration, value: messages.brand.registrationCode },
    { label: contactLabels.email, value: messages.brand.email, href: emailHref },
  ];

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/meist" labels={messages.header} brandName={messages.brand.name} textures={await getHeaderTextures()} />

      <main id="main" className="about-page-redesign">
        <section className="about-hero" aria-labelledby="about-hero-title" {...getCmsSectionProps(messages, "aboutHero")}>
          <TextureSlideshow set="dark" />
          {/* Meist-headeris kannab paremat veergu foto asemel suur logo
              (omanik 2026-07-20: "siia selle kivi pildi asemele pane logo
              suurelt") — taustaks jääb sektsiooni tekstuurislaid. */}
          <div className="about-hero-logo" aria-hidden="true">
            <img
              className="about-hero-logo-mark"
              src="/Logo/RAIO_horizontal_white_transparent.svg"
              alt=""
              width={3073}
              height={805}
              decoding="async"
            />
          </div>
          <div className="about-hero-panel">
            <h1 id="about-hero-title"><SteppedTitle text={t.heroTitle} /></h1>
            <span className="about-short-rule" aria-hidden="true" />
            <div className="about-hero-text">
              {t.heroText.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </section>

        <div className="about-content-section">
          <section className="about-story-panel" aria-labelledby="about-story-title" {...getCmsSectionProps(messages, "aboutStory")}>
            <TextureSlideshow set="green" />
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

          <section className="about-trainers-section" id="treenerid" aria-labelledby="about-trainers-title" {...getCmsSectionProps(messages, "aboutTrainers")}>
            <TextureSlideshow set="gray" />
            <div className="about-trainers-heading">
              <h2 id="about-trainers-title">{t.trainersTitle}</h2>
            </div>

            <div className="about-trainers-layout">
              {t.trainers.map((trainer) => (
                <article className="about-trainer-card" key={trainer.name}>
                  <div className="about-trainer-image">
                    <Image
                      src={trainer.image}
                      alt={trainer.imageAlt}
                      fill
                      sizes="(max-width: 980px) 100vw, 44vw"
                    />
                  </div>
                  <div className="about-trainer-copy">
                    <h3>{trainer.name}</h3>
                    <p>{trainer.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="about-closing-panel" aria-labelledby="about-closing-title" {...getCmsSectionProps(messages, "aboutClosing")}>
            <TextureSlideshow set="terracotta" />
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
            <aside className="about-contact-panel" id="kontakt" aria-labelledby="about-contact-title">
              <h3 id="about-contact-title">{contactLabels.title}</h3>
              <dl className="about-contact-list">
                {contactItems.map((item) => (
                  <div key={item.label} className="about-contact-row">
                    <dt>{item.label}</dt>
                    <dd>
                      {item.href ? <a href={item.href}>{item.value}</a> : item.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="about-contact-actions">
                <a
                  className="about-social-link"
                  href={instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={contactLabels.instagram}
                >
                  <InstagramIcon className="about-social-icon" aria-hidden="true" />
                  {/* Sama tekst, mis jaluses — konto nimi, mitte sõna
                      "Instagram" (omanik 2026-07-20). Tuletatud lingist, et
                      kaks kohta ei saaks lahku minna. */}
                  <span>{instagramHandle}</span>
                </a>
              </div>
            </aside>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
