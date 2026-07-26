import { JsonLd } from "@/components/JsonLd";
import { ShopPage } from "@/components/pages/ShopPage";
import { buildPageMetadata, buildShopBreadcrumbJsonLd, buildShopItemListJsonLd } from "@/lib/seo";

export const metadata = buildPageMetadata("et", "shop");
export const dynamic = "force-dynamic";

export default async function Pood() {
  const [itemListJsonLd, breadcrumbJsonLd] = await Promise.all([
    buildShopItemListJsonLd("et"),
    buildShopBreadcrumbJsonLd("et")
  ]);

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ShopPage locale="et" />
    </>
  );
}
