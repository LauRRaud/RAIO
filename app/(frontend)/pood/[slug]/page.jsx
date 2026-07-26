import { JsonLd } from "@/components/JsonLd";
import { ProductPage } from "@/components/pages/ProductPage";
import { buildProductJsonLd, buildProductMetadata, buildShopBreadcrumbJsonLd } from "@/lib/seo";
import { shopProducts } from "@/lib/shop";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return shopProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return buildProductMetadata("et", slug);
}

export default async function Product({ params }) {
  const { slug } = await params;
  const [productJsonLd, breadcrumbJsonLd] = await Promise.all([
    buildProductJsonLd("et", slug),
    buildShopBreadcrumbJsonLd("et", slug)
  ]);

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ProductPage locale="et" slug={slug} />
    </>
  );
}
