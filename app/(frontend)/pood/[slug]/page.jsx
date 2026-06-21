import { ProductPage } from "@/components/pages/ProductPage";
import { getLocalizedProduct, getMessages } from "@/lib/messages";
import { shopProducts } from "@/lib/shop";

export function generateStaticParams() {
  return shopProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const messages = getMessages("et");
  const product = getLocalizedProduct("et", slug);

  if (!product) {
    return { title: messages.product.notFound };
  }

  return {
    title: `${product.name} | ${messages.brand.name}`,
    description: product.description
  };
}

export default async function Product({ params }) {
  const { slug } = await params;
  return <ProductPage locale="et" slug={slug} />;
}
