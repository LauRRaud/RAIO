import { notFound } from "next/navigation";
import { AboutPage } from "@/components/pages/AboutPage";
import { CartPage } from "@/components/pages/CartPage";
import { EventsPage } from "@/components/pages/EventsPage";
import { HomePage } from "@/components/HomePage";
import { JournalPage } from "@/components/pages/JournalPage";
import { PaymentResultPage } from "@/components/pages/PaymentResultPage";
import { ProductPage } from "@/components/pages/ProductPage";
import { ShopPage } from "@/components/pages/ShopPage";
import { ToolsPage } from "@/components/pages/ToolsPage";
import { TrainingPage } from "@/components/pages/TrainingPage";
import { JsonLd } from "@/components/JsonLd";
import {
  buildPageMetadata,
  buildProductJsonLd,
  buildProductMetadata,
  buildShopBreadcrumbJsonLd,
  buildShopItemListJsonLd,
  buildSiteMetadata
} from "@/lib/seo";

export const dynamic = "force-dynamic";

const routePages = {
  treeningud: { page: "training", Component: TrainingPage },
  vahendid: { page: "tools", Component: ToolsPage },
  sundmused: { page: "events", Component: EventsPage },
  journal: { page: "journal", Component: JournalPage },
  pood: { page: "shop", Component: ShopPage },
  ostukorv: { page: "cart", Component: CartPage },
  makse: { page: "payment", Component: PaymentResultPage },
  meist: { page: "about", Component: AboutPage }
};

function getRouteKey(slug) {
  return slug?.length ? slug.join("/") : "";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const route = getRouteKey(slug);

  if (!route || route === "en") {
    return buildPageMetadata("en", "home");
  }

  if (routePages[route]) {
    return buildPageMetadata("en", routePages[route].page);
  }

  if (route.startsWith("pood/")) {
    const productSlug = route.split("/").slice(1).join("/");
    return buildProductMetadata("en", productSlug);
  }

  const site = await buildSiteMetadata("en");
  return { title: site.title };
}

export default async function EnglishSitePage({ params, searchParams }) {
  const { slug } = await params;
  const route = getRouteKey(slug);

  if (!route || route === "en") {
    return <HomePage locale="en" />;
  }

  // Makse tulemusleht vajab query-parameetreid (status, order), mille üldine
  // routePages-haru muidu maha jätaks.
  if (route === "makse") {
    const sp = (await searchParams) || {};
    return <PaymentResultPage locale="en" status={sp.status} orderNumber={sp.order} />;
  }

  if (route === "pood") {
    const [itemListJsonLd, breadcrumbJsonLd] = await Promise.all([
      buildShopItemListJsonLd("en"),
      buildShopBreadcrumbJsonLd("en")
    ]);
    return (
      <>
        <JsonLd data={itemListJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />
        <ShopPage locale="en" />
      </>
    );
  }

  if (routePages[route]) {
    const { Component } = routePages[route];
    return <Component locale="en" />;
  }

  if (route.startsWith("pood/")) {
    const productSlug = route.split("/").slice(1).join("/");
    const [productJsonLd, breadcrumbJsonLd] = await Promise.all([
      buildProductJsonLd("en", productSlug),
      buildShopBreadcrumbJsonLd("en", productSlug)
    ]);
    return (
      <>
        <JsonLd data={productJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />
        <ProductPage locale="en" slug={productSlug} />
      </>
    );
  }

  notFound();
}
