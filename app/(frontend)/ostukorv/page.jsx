import { CartPage } from "@/components/pages/CartPage";
import { getPageMetadata } from "@/lib/messages";

export const metadata = getPageMetadata("et", "cart");

export default function Ostukorv() {
  return <CartPage locale="et" />;
}
