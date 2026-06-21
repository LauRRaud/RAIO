import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductGallery } from "@/components/ProductGallery";
import { getLocalizedPath } from "@/lib/i18n";
import {
  getLocalizedProduct,
  getLocalizedProducts,
  getMessages,
} from "@/lib/messages";
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
    (item) => item.slug !== product.slug && item.category === product.category,
  );

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath={`/pood/${slug}`} labels={messages.header} brandName={messages.brand.name} />
      <main id="main" className="product-page">
        <section className="product-hero section">
          <div className="container product-grid">
            <ProductGallery
              images={product.images}
              productName={product.name}
              labels={t.gallery}
            />

            <div className="product-copy">
              <h1>{product.name}</h1>
              <div className="product-status-row">
                <strong>{formatCurrency(product.price)}</strong>
              </div>
              <p className="lede product-lede">{product.description}</p>

              <div className="product-actions">
                <AddToCartButton
                  product={product}
                  label={shop.actionLabels[product.status]}
                  addedLabel={shop.addedToCart}
                  disabledLabel={shop.actionLabels.TEMPORARILY_UNAVAILABLE}
                />
              </div>

              <div className="product-meta">
                <div>
                  <span>{t.metaCategory}</span>
                  <strong>{product.categoryLabel || product.category}</strong>
                </div>
                <div>
                  <span>{shop.metaPreorder}</span>
                  <strong>{shop.statusLabels[product.status]}</strong>
                </div>
                <div>
                  <span>{t.metaProduction}</span>
                  <strong>
                    {product.productionNote} {product.estimatedProductionTime}.
                  </strong>
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
                  <Link
                    key={item.slug}
                    href={path(`/pood/${item.slug}`)}
                    className="related-card"
                  >
                    <span className="related-card-media">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        sizes="(max-width: 900px) 100vw, 24vw"
                      />
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
