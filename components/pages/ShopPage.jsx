import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroMedia } from "@/components/HeroMedia";
import { StoreCatalog } from "@/components/StoreCatalog";
import { getMessagesWithAdminImages, getPayloadProducts } from "@/lib/payloadContent";

export async function ShopPage({ locale = "et" }) {
  const messages = await getMessagesWithAdminImages(locale);
  const t = messages.shop;
  const products = await getPayloadProducts(locale);

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
            <HeroMedia desktop={t.heroImage} mobile={t.heroImageMobile} />
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
