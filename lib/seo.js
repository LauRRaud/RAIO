import { getHomeMetadata, getMessages, getPageMetadata } from "@/lib/messages";
import { getPayloadProduct, getPayloadProducts } from "@/lib/payloadContent";

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

/* Ostuvoo lehed ei kuulu otsingutulemustesse. Robots.txt EI tohi neid
   samal ajal crawl'ist keelata — keelatud lehelt ei loeta kunagi noindex'it
   ja leht võib välislinkide kaudu ikkagi indeksisse sattuda. */
const NOINDEX_PAGES = new Set(["cart", "payment"]);

function localePath(locale, etPath) {
  if (locale !== "en") return etPath;
  return etPath === "/" ? "/en" : `/en${etPath}`;
}

/* Payload upload.url on juba protsent-kodeeritud ("kivi%20sangpomm.jpg"),
   staatiline vaikeväärtus lib/shop.js-is mitte ("oma materjal.png"). Pime
   encodeURI annaks esimesel juhul %2520 ja katkise pildi-URL-i — decode-siis-
   encode on idempotentne ja töötab mõlemal. */
function normalizeEncoding(path) {
  try {
    return encodeURI(decodeURI(path));
  } catch {
    return encodeURI(path);
  }
}

/* CMS-i pildid tulevad juba absoluutse URL-ina (Payload upload) või saidi
   juurest algava teena (staatiline fallback). JSON-LD nõuab absoluutset. */
function absoluteUrl(src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return `${getPublicSiteUrl()}${normalizeEncoding(src)}`;
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

/* Tootelehe metadata JA JSON-LD loevad sama allika (Payload) kui leht ise.
   Varem lugesid need lib/shop.js staatilist vaikeväärtust — kui omanik
   muutis admin'is hinda, näitas leht uut ja Google luges vana. */
export async function buildProductMetadata(locale, slug) {
  const messages = getMessages(locale);
  const product = await getPayloadProduct(locale, slug);

  if (!product) return { title: messages.product.notFound, robots: { index: false, follow: false } };

  return sharedMetadata({
    locale,
    title: `${product.name} | ${messages.brand.name}`,
    description: product.description,
    etPath: `/pood/${slug}`,
    ogImage: product.images?.[0]
  });
}

const AVAILABILITY = {
  AVAILABLE: "https://schema.org/InStock",
  MADE_TO_ORDER: "https://schema.org/MadeToOrder",
  PREORDER: "https://schema.org/PreOrder",
  TEMPORARILY_UNAVAILABLE: "https://schema.org/OutOfStock"
};

/* Tagastustingimused. 14 päeva on tarbija seadusest tulenev taganemisõigus
   (VÕS § 56), tagastuskulu kannab ostja, kui teda on sellest teavitatud.
   Kui pood lepib kokku soodsamad tingimused, muuda SIIN — Google võrdleb
   neid välju poe avalike tingimustega. */
const RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "EE",
  returnPolicyCountry: "EE",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 14,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/ReturnShippingFees"
};

export async function buildProductJsonLd(locale, slug) {
  const messages = getMessages(locale);
  const product = await getPayloadProduct(locale, slug);
  if (!product) return null;

  const site = getPublicSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku || product.slug,
    category: product.categoryLabel || product.category,
    image: (product.images || []).map(absoluteUrl).filter(Boolean),
    brand: { "@type": "Brand", name: messages.brand.name },
    offers: {
      "@type": "Offer",
      url: `${site}${localePath(locale, `/pood/${slug}`)}`,
      priceCurrency: "EUR",
      price: product.price,
      availability: AVAILABILITY[product.status] || "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: messages.brand.name },
      hasMerchantReturnPolicy: RETURN_POLICY
    }
  };
}

/* Leivapuru: annab otsingutulemuses URL-i asemel nähtava teekonna
   (RA•IO › Pood › Kivisangpomm). `trail` = [{ name, etPath }] ilma juurt. */
export function buildBreadcrumbJsonLd(locale, trail) {
  if (!trail?.length) return null;
  const site = getPublicSiteUrl();
  const messages = getMessages(locale);

  const items = [{ name: messages.brand.name, etPath: "/" }, ...trail];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site}${localePath(locale, item.etPath)}`
    }))
  };
}

export async function buildShopBreadcrumbJsonLd(locale, slug) {
  const shopName = getPageMetadata(locale, "shop").breadcrumb || (locale === "en" ? "Shop" : "Pood");

  const trail = [{ name: shopName, etPath: "/pood" }];
  if (slug) {
    const product = await getPayloadProduct(locale, slug);
    if (product) trail.push({ name: product.name, etPath: `/pood/${slug}` });
  }

  return buildBreadcrumbJsonLd(locale, trail);
}

/* Poe nimekirjaleht: ItemList seob tootelehed üheks komplektiks, nii et
   Google ei pea neid ainult siselinkide kaudu avastama. */
export async function buildShopItemListJsonLd(locale) {
  const products = await getPayloadProducts(locale);
  if (!products?.length) return null;

  const site = getPublicSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site}${localePath(locale, `/pood/${product.slug}`)}`,
      name: product.name
    }))
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
