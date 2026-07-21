import { JsonLd } from "@/components/JsonLd";
import { ProductPage } from "@/components/pages/ProductPage";
import { buildProductJsonLd, buildProductMetadata } from "@/lib/seo";
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
  return (
    <>
      <JsonLd data={buildProductJsonLd("et", slug)} />
      <ProductPage locale="et" slug={slug} />
    </>
  );
}
