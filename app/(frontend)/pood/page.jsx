import { ShopPage } from "@/components/pages/ShopPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("et", "shop");
export const dynamic = "force-dynamic";

export default function Pood() {
  return <ShopPage locale="et" />;
}
