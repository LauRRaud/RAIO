import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoreCatalog } from "@/components/StoreCatalog";
import { getLocalizedProducts, getMessages } from "@/lib/messages";

export function ShopPage({ locale = "et" }) {
  const messages = getMessages(locale);
  const t = messages.shop;
  const products = getLocalizedProducts(locale);

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/pood" labels={messages.header} brandName={messages.brand.name} />

      <main id="main" className="store-page">
        <section className="store-hero" aria-labelledby="store-hero-title">
          <div className="store-hero-copy">
            <h1 id="store-hero-title">{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <span className="store-short-rule" aria-hidden="true" />
            <p>{t.heroNote}</p>
          </div>
          <div className="store-hero-image" style={{ "--hero-image-position": t.heroImagePosition }} aria-hidden="true">
            <Image src={t.heroImage} alt="" fill priority quality={92} sizes="(max-width: 980px) 100vw, 80vw" />
          </div>
        </section>

        <section className="store-products-section" aria-labelledby="store-products-title">
          <StoreCatalog categories={t.categories} products={products} locale={locale} labels={t} />
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
