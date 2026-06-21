import { ProductPage } from "@/components/pages/ProductPage";
import { getLocalizedProduct, getMessages } from "@/lib/messages";
import { shopProducts } from "@/lib/shop";

export function generateStaticParams() {
  return shopProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getLocalizedProduct("et", slug);

  if (!product) {
    return { title: getMessages("et").product.notFound };
  }

  return {
    title: `${product.name} | RA•IO`,
    description: product.description
  };
}

export default async function Product({ params }) {
  const { slug } = await params;
  return <ProductPage locale="et" slug={slug} />;
}
