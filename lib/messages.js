import en from "@/messages/en.json";
import et from "@/messages/et.json";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { shopProducts } from "@/lib/shop";

const catalogs = { et, en };

export function getMessages(locale = defaultLocale) {
  return catalogs[isLocale(locale) ? locale : defaultLocale];
}

export function getHomeMessages(locale = defaultLocale) {
  return getMessages(locale).home;
}

export function getHomeMetadata(locale = defaultLocale) {
  return getHomeMessages(locale).metadata;
}

export function getPageMetadata(locale, page) {
  return getMessages(locale)[page]?.metadata || {};
}

// Merge locale-neutral product data (price, images, status, slug, category)
// with translated copy (name, description, categoryLabel, productionNote).
export function getLocalizedProducts(locale = defaultLocale) {
  const copy = getMessages(locale).shop.products || {};
  return shopProducts.map((product) => ({
    ...product,
    ...(copy[product.slug] || {})
  }));
}

export function getLocalizedProduct(locale, slug) {
  return getLocalizedProducts(locale).find((product) => product.slug === slug);
}
