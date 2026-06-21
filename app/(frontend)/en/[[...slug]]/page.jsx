import { notFound } from "next/navigation";
import { AboutPage } from "@/components/pages/AboutPage";
import { CartPage } from "@/components/pages/CartPage";
import { EventsPage } from "@/components/pages/EventsPage";
import { HomePage } from "@/components/HomePage";
import { JournalPage } from "@/components/pages/JournalPage";
import { ProductPage } from "@/components/pages/ProductPage";
import { ShopPage } from "@/components/pages/ShopPage";
import { ToolsPage } from "@/components/pages/ToolsPage";
import { TrainingPage } from "@/components/pages/TrainingPage";
import { getHomeMetadata, getLocalizedProduct, getMessages, getPageMetadata } from "@/lib/messages";

const routePages = {
  treeningud: { page: "training", Component: TrainingPage },
  vahendid: { page: "tools", Component: ToolsPage },
  sundmused: { page: "events", Component: EventsPage },
  journal: { page: "journal", Component: JournalPage },
  pood: { page: "shop", Component: ShopPage },
  ostukorv: { page: "cart", Component: CartPage },
  meist: { page: "about", Component: AboutPage }
};

function getRouteKey(slug) {
  return slug?.length ? slug.join("/") : "";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const route = getRouteKey(slug);
  const messages = getMessages("en");

  if (!route || route === "en") {
    return getHomeMetadata("en");
  }

  if (routePages[route]) {
    return getPageMetadata("en", routePages[route].page);
  }

  if (route.startsWith("pood/")) {
    const productSlug = route.split("/").slice(1).join("/");
    const product = getLocalizedProduct("en", productSlug);
    return product
      ? { title: `${product.name} | ${messages.brand.name}`, description: product.description }
      : { title: messages.product.notFound };
  }

  return { title: messages.metadata.title };
}

export default async function EnglishSitePage({ params }) {
  const { slug } = await params;
  const route = getRouteKey(slug);

  if (!route || route === "en") {
    return <HomePage locale="en" />;
  }

  if (routePages[route]) {
    const { Component } = routePages[route];
    return <Component locale="en" />;
  }

  if (route.startsWith("pood/")) {
    const productSlug = route.split("/").slice(1).join("/");
    return <ProductPage locale="en" slug={productSlug} />;
  }

  notFound();
}
