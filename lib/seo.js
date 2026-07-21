import { getHomeMetadata, getLocalizedProduct, getMessages, getPageMetadata } from "@/lib/messages";

/* Avalik saidi aadress SEO jaoks (canonical, sitemap, og:url, JSON-LD).
   Sama konventsioon mis lib/maksekeskus.js getSiteUrl — aga ilma request'ita,
   sest metadata ja sitemap ehitatakse ka ilma sissetuleva päringuta. */
export function getPublicSiteUrl() {
  const configured = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  return "http://localhost:3000";
}

const OG_DEFAULT_IMAGE = "/og/og-default.jpg";

/* Lehevõtme → eesti route'i tee. Inglise tee on alati /en + sama tee
   (en/[[...slug]] catch-all kasutab eesti slug'e). */
const PAGE_PATHS = {
  home: "/",
  training: "/treeningud",
  tools: "/vahendid",
  events: "/sundmused",
  journal: "/journal",
  shop: "/pood",
  about: "/meist",
  cart: "/ostukorv",
  payment: "/makse"
};

/* Ostuvoo lehed ei kuulu otsingutulemustesse. */
const NOINDEX_PAGES = new Set(["cart", "payment"]);

function localePath(locale, etPath) {
  if (locale !== "en") return etPath;
  return etPath === "/" ? "/en" : `/en${etPath}`;
}

function alternatesFor(etPath) {
  return {
    canonical: undefined, // täidetakse buildis locale-teega
    languages: {
      et: etPath,
      en: localePath("en", etPath),
      "x-default": etPath
    }
  };
}

function sharedMetadata({ locale, title, description, etPath, ogImage }) {
  const path = localePath(locale, etPath);
  const image = ogImage || OG_DEFAULT_IMAGE;

  return {
    title,
    description,
    alternates: { ...alternatesFor(etPath), canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: getMessages(locale).brand.name,
      locale: locale === "en" ? "en_GB" : "et_EE",
      type: "website",
      images: [{ url: image, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export function buildPageMetadata(locale, pageKey) {
  const md = pageKey === "home" ? getHomeMetadata(locale) : getPageMetadata(locale, pageKey);
  const etPath = PAGE_PATHS[pageKey] || "/";
  const result = sharedMetadata({
    locale,
    title: md.title,
    description: md.description,
    etPath
  });

  if (NOINDEX_PAGES.has(pageKey)) {
    result.robots = { index: false, follow: true };
  }

  return result;
}

export function buildProductMetadata(locale, slug) {
  const messages = getMessages(locale);
  const product = getLocalizedProduct(locale, slug);

  if (!product) return { title: messages.product.notFound };

  return sharedMetadata({
    locale,
    title: `${product.name} | ${messages.brand.name}`,
    description: product.description,
    etPath: `/pood/${slug}`,
    ogImage: product.images?.[0]
  });
}

const AVAILABILITY = {
  PREORDER: "https://schema.org/PreOrder",
  TEMPORARILY_UNAVAILABLE: "https://schema.org/OutOfStock"
};

export function buildProductJsonLd(locale, slug) {
  const messages = getMessages(locale);
  const product = getLocalizedProduct(locale, slug);
  if (!product) return null;

  const site = getPublicSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.slug,
    image: (product.images || []).map((src) => `${site}${encodeURI(src)}`),
    brand: { "@type": "Brand", name: messages.brand.name },
    offers: {
      "@type": "Offer",
      url: `${site}${localePath(locale, `/pood/${slug}`)}`,
      priceCurrency: "EUR",
      price: product.price,
      availability: AVAILABILITY[product.status] || "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  };
}

export function buildOrganizationJsonLd() {
  const messages = getMessages("et");
  const site = getPublicSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: messages.brand.name,
    legalName: messages.brand.company,
    url: site,
    logo: `${site}/Logo/RAIO_horizontal_black_transparent.png`,
    sameAs: ["https://www.instagram.com/ra.ioworld"]
  };
}
