import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Droplets, Hand, Leaf, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getLocalizedPath } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

const proofIcons = { leaf: Leaf, hand: Hand, clock: Clock3 };

export function ToolsPage({ locale = "et" }) {
  const messages = getMessages(locale);
  const t = messages.tools;
  const path = (href) => getLocalizedPath(locale, href);
  const contactHref = path("/meist#kontakt");

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/vahendid" />

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
            <Image src={t.heroImage} alt="" fill priority quality={92} sizes="(max-width: 980px) 100vw, 80vw" />
          </div>
        </section>

        <section className="tools-category-section" aria-labelledby="tools-category-title">
          <div className="tools-section-top">
            <h2 id="tools-category-title">{t.categoriesTitle}</h2>
          </div>

          <div className="tools-category-grid">
            {t.categories.map((category) => (
              <article className="tools-category-card" key={category.title}>
                <Link href={path(category.href)} className="tools-category-image" aria-label={category.title}>
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    loading="eager"
                    sizes="(max-width: 900px) 100vw, 20vw"
                  />
                </Link>
                <div className="tools-category-body">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <Link href={path(category.href)} className="tools-text-link">
                    {t.categoryCta}
                    <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
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

            <div className="tools-material-values">
              {t.material.values.map((value, index) => (
                <article key={value.title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="tools-bottom-grid">
            <section className="tools-care-card" aria-labelledby="tools-care-title">
              <div className="tools-care-copy">
                <Droplets size={29} strokeWidth={1.45} aria-hidden="true" />
                <h2 id="tools-care-title">{t.care.title}</h2>
                {t.care.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="tools-care-image">
                <Image
                  src={t.care.image}
                  alt={t.care.imageAlt}
                  fill
                  loading="eager"
                  sizes="(max-width: 900px) 100vw, 25vw"
                />
              </div>
            </section>

            <section className="tools-custom-card" aria-labelledby="tools-custom-title">
              <div className="tools-custom-copy">
                <Sparkles size={28} strokeWidth={1.45} aria-hidden="true" />
                <h2 id="tools-custom-title">{t.custom.title}</h2>
                {t.custom.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <Link href={contactHref} className="tools-solid-button">
                  {t.custom.cta}
                </Link>
              </div>
              <div className="tools-custom-image">
                <Image
                  src={t.custom.image}
                  alt={t.custom.imageAlt}
                  fill
                  loading="eager"
                  sizes="(max-width: 900px) 100vw, 32vw"
                />
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
