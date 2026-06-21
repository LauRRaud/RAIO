import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getLocalizedPath } from "@/lib/i18n";
import { getLocalizedProduct, getLocalizedProducts, getMessages } from "@/lib/messages";
import { formatCurrency } from "@/lib/shop";

export function ProductPage({ locale = "et", slug }) {
  const messages = getMessages(locale);
  const t = messages.product;
  const shop = messages.shop;
  const product = getLocalizedProduct(locale, slug);

  if (!product) {
    notFound();
  }

  const path = (href) => getLocalizedPath(locale, href);
  const related = getLocalizedProducts(locale).filter(
    (item) => item.slug !== product.slug && item.category === product.category
  );

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath={`/pood/${slug}`} />
      <main id="main" className="product-page">
        <section className="product-hero section">
          <div className="container product-grid">
            <div className="product-gallery">
              <div className="product-primary-media">
                <Image src={product.images[0]} alt={product.name} fill priority sizes="(max-width: 900px) 100vw, 42vw" />
              </div>
              <div className="product-thumb-row">
                {product.images.map((image, index) => (
                  <div key={index} className="product-thumb">
                    <Image src={image} alt={`${product.name} ${index + 1}`} fill sizes="120px" />
                  </div>
                ))}
              </div>
            </div>

            <div className="product-copy">
              <h1>{product.name}</h1>
              <div className="product-status-row">
                <strong>{formatCurrency(product.price)}</strong>
              </div>
              <p className="lede product-lede">{product.description}</p>

              <div className="product-actions">
                <AddToCartButton product={product} label={shop.actionLabels[product.status]} addedLabel={shop.addedToCart} />
              </div>

              <div className="product-meta">
                <div>
                  <span>{t.metaCategory}</span>
                  <strong>{product.categoryLabel || product.category}</strong>
                </div>
                <div>
                  <span>{t.metaNote}</span>
                  <strong>{product.productionNote} {product.estimatedProductionTime}.</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="section product-related-section">
            <div className="container product-related-layout">
              <div className="product-related-heading">
                <h2>{t.relatedEyebrow}</h2>
              </div>

              <div className="related-grid">
                {related.map((item) => (
                  <Link key={item.slug} href={path(`/pood/${item.slug}`)} className="related-card">
                    <span className="related-card-media">
                      <Image src={item.images[0]} alt={item.name} fill sizes="(max-width: 900px) 100vw, 24vw" />
                    </span>
                    <strong>{item.name}</strong>
                    <span>{formatCurrency(item.price)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer locale={locale} />
    </>
  );
}
