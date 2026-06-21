import { ShopPage } from "@/components/pages/ShopPage";
import { getPageMetadata } from "@/lib/messages";

export const metadata = getPageMetadata("et", "shop");
export const dynamic = "force-dynamic";

export default function Pood() {
  return <ShopPage locale="et" />;
}
