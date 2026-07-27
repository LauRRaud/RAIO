import { CartPage } from "@/components/pages/CartPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata("et", "cart");
}

export default function Ostukorv() {
  return <CartPage locale="et" />;
}
