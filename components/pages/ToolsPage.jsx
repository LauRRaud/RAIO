import Image from "next/image";
import Link from "next/link";
import { Clock3, Hand, Leaf } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroMedia } from "@/components/HeroMedia";
import { ToolsCategoryCarousel } from "@/components/ToolsCategoryCarousel";
import { getLocalizedPath } from "@/lib/i18n";
import { getMessagesWithAdminImages } from "@/lib/payloadContent";

const proofIcons = { leaf: Leaf, hand: Hand, clock: Clock3 };

export async function ToolsPage({ locale = "et" }) {
  const messages = await getMessagesWithAdminImages(locale);
  const t = messages.tools;

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/vahendid" labels={messages.header} brandName={messages.brand.name} />

      <main id="main" className="tools-page-redesign">
        <section className="tools-hero-redesign" aria-labelledby="tools-hero-title">
          <div className="tools-hero-panel">
            <h1 id="tools-hero-title">{t.heroTitle}</h1>
            <span className="tools-short-rule" aria-hidden="true" />
            <div className="tools-hero-text">
              {t.heroText.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

          </div>

          <div className="tools-hero-image" style={{ "--hero-image-position": t.heroImagePosition }} aria-hidden="true">
            <HeroMedia desktop={t.heroImage} mobile={t.heroImageMobile} />
          </div>
        </section>

        <section className="tools-category-section" aria-labelledby="tools-category-title">
          <div className="tools-category-band">
            <div className="tools-section-top">
              <h2 id="tools-category-title">{t.categoriesTitle}</h2>
            </div>

            <ToolsCategoryCarousel categories={t.categories} cta={t.categoryCta} locale={locale} labels={messages.carousel.tools} />
          </div>

          <section className="tools-material-panel" aria-labelledby="tools-material-title">
            <div className="tools-material-copy">
              <h2 id="tools-material-title">{t.material.title}</h2>
              <p>{t.material.text}</p>

              <div className="tools-proof-row tools-material-proof-row" aria-label={t.proofLabel}>
                {t.heroProof.map((item) => {
                  const Icon = proofIcons[item.icon] || Leaf;

                  return (
                    <div className="tools-proof-item" key={item.label}>
                      <Icon size={26} strokeWidth={1.35} aria-hidden="true" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="tools-material-image">
              <Image
                src={t.material.image}
                alt={t.material.imageAlt}
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 42vw"
              />
            </div>
          </section>

          <section className="tools-support-band" aria-labelledby="tools-care-title">
            <div className="tools-care-image">
              <Image
                src={t.care.image}
                alt={t.care.imageAlt}
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 44vw"
              />
            </div>

            <div className="tools-care-copy">
              <h2 id="tools-care-title">{t.care.title}</h2>
              {t.care.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
