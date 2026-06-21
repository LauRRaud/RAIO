import { ShopPage } from "@/components/pages/ShopPage";
import { getPageMetadata } from "@/lib/messages";

export const metadata = getPageMetadata("et", "shop");

export default function Pood() {
  return <ShopPage locale="et" />;
}
