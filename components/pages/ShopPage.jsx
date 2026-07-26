import { SteppedTitle } from "@/components/SteppedTitle";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getHeaderTextures } from "@/lib/payloadContent";
import { HeroMedia } from "@/components/HeroMedia";
import { StoreCatalog } from "@/components/StoreCatalog";
import { getLocalizedPath } from "@/lib/i18n";
import { getCmsSectionProps, getMessagesWithAdminImages, getPayloadProducts } from "@/lib/payloadContent";
import { TextureSlideshow } from "@/components/TextureSlideshow";

export async function ShopPage({ locale = "et" }) {
  const messages = await getMessagesWithAdminImages(locale);
  const t = messages.shop;
  const custom = messages.tools.custom;
  const contactHref = getLocalizedPath(locale, "/meist#kontakt");
  const products = await getPayloadProducts(locale);

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/pood" labels={messages.header} brandName={messages.brand.name} textures={await getHeaderTextures()} />

      <main id="main" className="store-page">
        <section className="store-hero" aria-labelledby="store-hero-title" {...getCmsSectionProps(messages, "shopHero")}>
          <TextureSlideshow set="dark" />
          <div className="store-hero-copy">
            <h1 id="store-hero-title"><SteppedTitle text={t.heroTitle} /></h1>
            <span className="store-short-rule" aria-hidden="true" />
            <div className="store-hero-text">
              <p>{t.heroText}</p>
              <p>{t.heroNote}</p>
            </div>
          </div>
          <div className="store-hero-image" style={{ "--hero-image-position": t.heroImagePosition }} aria-hidden="true">
            <HeroMedia desktop={t.heroImage} mobile={t.heroImageMobile} />
          </div>
        </section>

        <section className="store-products-section" aria-labelledby="store-products-title" {...getCmsSectionProps(messages, "shopProducts")}>
          <TextureSlideshow set="green" />
          <StoreCatalog categories={t.categories} products={products} locale={locale} labels={t} />
        </section>

        <section className="store-custom-band" aria-labelledby="store-custom-title" {...getCmsSectionProps(messages, "shopCustom")}>
          <TextureSlideshow set="terracotta" />
          <div className="store-custom-copy">
            <h2 id="store-custom-title">{custom.title}</h2>
            {custom.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <Link href={contactHref} className="store-solid-button">
              {custom.cta}
            </Link>
          </div>
          <div className="store-custom-image">
            <Image
              src={custom.image}
              alt={custom.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 44vw"
            />
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
