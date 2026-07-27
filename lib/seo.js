import { getHomeMetadata, getMessages, getPageMetadata } from "@/lib/messages";
import { getPayloadProduct, getPayloadProducts, getSeoSettings } from "@/lib/payloadContent";

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

/* og:image mõõdud tohib välja öelda ainult siis, kui need on päriselt teada.
   Varem seisis siin kõva 1200×630 IGA pildi juures — ka tootefotol, mis on
   ruudukujuline. Facebook usub deklaratsiooni ja renderdab eelvaate 1,91:1
   kastis, seega ruudust sai poolik ruut. Teadmata mõõduga pilt tuleb saata
   ilma mõõtudeta: siis Facebook mõõdab faili ise ära. */
function imageEntry(image) {
  if (!image) return null;
  /* Tootepilt tuleb siia paljas URL-ina (lib/shop.js) — ka tema peab jõudma
     staatilisele teele, muidu jääb tootelehe jagamispilt Facebookis katki. */
  if (typeof image === "string") return { url: staticMediaUrl(image) };

  const { url, width, height } = image;
  if (!url) return null;

  return width && height ? { url, width, height } : { url };
}

/* Vaikepilt on meie enda fail ja tema mõõdud on teada — vt scripts/
   generate-og-cards.mjs. */
const OG_DEFAULT_ENTRY = { url: OG_DEFAULT_IMAGE, width: 1200, height: 630 };

function sharedMetadata({ locale, title, description, etPath, ogImage }) {
  const path = localePath(locale, etPath);
  const image = imageEntry(ogImage) || OG_DEFAULT_ENTRY;

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
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url]
    }
  };
}

/* Admini väli võidab ainult siis, kui seal on päriselt midagi kirjas. Tühi
   string, tühikud ja null tähendavad kõik "jäta koodi väärtus alles" — nii ei
   saa admin kogemata tühja pealkirja avalikule lehele saata. */
function pickText(cmsValue, fallback) {
  const trimmed = typeof cmsValue === "string" ? cmsValue.trim() : "";
  return trimmed || fallback;
}

/* Payloadi upload tuleb kas objektina (depth: 1) või paljas ID-na. Mõõdud
   tulevad kaasa, sest imageEntry() ei tohi neid ise välja mõelda.

   URL saab kaasa versioonitempli. Kaks põhjust, mõlemad Facebooki omad:

   1. Facebook seob pildi ebaõnnestunud tõmbamise KONKREETSE aadressiga ja ei
      proovi seda enam uuesti, ka mitte pärast lehe uut kraapimist. Kui pilt oli
      korra kättesaamatu (meil: HEAD andis 404, vt app/(payload)/api/[...slug]/
      route.ts), jääb see aadress tema jaoks igaveseks katkiseks. Uus aadress =
      uus katse.
   2. Kui omanik vahetab admin'is jagamispilti, jääb failinimi sageli samaks ja
      Facebook näitaks vana pilti veel nädalaid. Muutuv tempel sunnib ta uut
      tõmbama.

   Tempel on updatedAt, mitte juhuslik number: sama pilt annab sama URL-i, seega
   vahemälu töötab endiselt ja alles päris muudatus toob uue aadressi. */
function uploadImage(value) {
  if (!value || typeof value !== "object" || !value.url) return null;

  const stamp = Date.parse(value.updatedAt || "");
  const versioned = Number.isFinite(stamp) ? `?v=${Math.floor(stamp / 1000)}` : "";

  return { url: staticMediaUrl(value.url) + versioned, width: value.width, height: value.height };
}

/* Facebook EI SUUDA lugeda pilti Payloadi marsruudilt: Sharing Debugger vastab
   "could not be processed as an image" ka siis, kui GET ja HEAD annavad 200
   image/jpeg, fail on puhas baseline JPEG ja vastus tuleb veerand sekundiga.
   Sama fail SAMA baidina staatiliselt teelt läheb tal probleemideta sisse.
   Vahe on paarides, mida marsruut lisab (CORS, teine `vary`) ja neis, mida ta
   ei anna (Cache-Control, ETag, Last-Modified) — täpset süüdlast tema poolel
   me ei näe, aga töötav tee on teada.

   Media.staticDir on public/media, seega iga upload on ka staatilise faili
   nime all olemas. Teisendame ainult URL-i eesliite: `value.url` on juba
   protsent-kodeeritud ("kivi%20sangpomm.jpg") ja kodeeringut ei tohi puutuda.
   NB! Kui failid kunagi pilve kolivad, see tee kaob ja siin tuleb uuesti
   mõelda. */
function staticMediaUrl(url) {
  return url.startsWith("/api/media/file/") ? url.replace("/api/media/file/", "/media/") : url;
}

export async function buildPageMetadata(locale, pageKey) {
  const md = pageKey === "home" ? getHomeMetadata(locale) : getPageMetadata(locale, pageKey);
  const etPath = PAGE_PATHS[pageKey] || "/";
  const seo = await getSeoSettings(locale);
  const page = seo?.[pageKey];

  const result = sharedMetadata({
    locale,
    title: pickText(page?.title, md.title),
    description: pickText(page?.description, md.description),
    etPath,
    ogImage: uploadImage(page?.shareImage) || uploadImage(seo?.defaultShareImage)
  });

  if (NOINDEX_PAGES.has(pageKey)) {
    result.robots = { index: false, follow: true };
  }

  return result;
}

/* Juurlayout'i vaikeväärtus: kehtib ainult lehtedel, mis ise pealkirja ei anna. */
export async function buildSiteMetadata(locale = "et") {
  const messages = getMessages(locale);
  const seo = await getSeoSettings(locale);

  return {
    title: pickText(seo?.site?.title, messages.metadata.title),
    description: pickText(seo?.site?.description, messages.metadata.description)
  };
}

/* robots.txt ja sitemap.xml sisu tuleb samast globaalist. Mõlemad langevad DB
   puudumisel tagasi koodis kirjeldatud vaikeväärtusele. */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "meta-externalagent"
];

export async function buildRobots() {
  const site = getPublicSiteUrl();
  const seo = await getSeoSettings("et");

  /* /admin ja /api/ on kõvasti koodis — need ei ole admini otsustada.
     Ostukorv ja makse EI kuulu siia: neil on lehe peal noindex ja crawl'i
     keeld takistaks robotil seda lugeda (vt NOINDEX_PAGES). */
  const disallow = ["/admin", "/api/"];

  for (const line of String(seo?.robots?.extraDisallow || "").split(/\r?\n/)) {
    const path = line.trim();
    if (path && path !== "/" && path.startsWith("/") && !/\s/.test(path) && !disallow.includes(path)) {
      disallow.push(path);
    }
  }

  const rules = [{ userAgent: "*", allow: "/", disallow }];

  if (seo?.robots?.allowAiBots === false) {
    rules.push({ userAgent: AI_CRAWLERS, disallow: "/" });
  }

  return { rules, sitemap: `${site}/sitemap.xml` };
}

/* Sitemap'i linnukesed. Tundmatu võti = sees, sest uus leht peab jõudma
   nimekirja ka siis, kui globaali pole veel salvestatud. */
export async function getSitemapToggles() {
  const seo = await getSeoSettings("et");
  const flags = seo?.sitemap || {};
  return (key) => flags[key] !== false;
}

/* Tootelehe metadata JA JSON-LD loevad sama allika (Payload) kui leht ise.
   Varem lugesid need lib/shop.js staatilist vaikeväärtust — kui omanik
   muutis admin'is hinda, näitas leht uut ja Google luges vana. */
export async function buildProductMetadata(locale, slug) {
  const messages = getMessages(locale);
  const product = await getPayloadProduct(locale, slug);

  if (!product) return { title: messages.product.notFound, robots: { index: false, follow: false } };

  const seo = await getSeoSettings(locale);

  return sharedMetadata({
    locale,
    title: `${product.name} | ${messages.brand.name}`,
    description: product.description,
    etPath: `/pood/${slug}`,
    ogImage: product.images?.[0] || uploadImage(seo?.defaultShareImage)
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

/* Struktuurandmed "Korralda oma sündmus" pakkumisele. Võtab juba laaditud
   messages'i (mitte staatilise faili), sest sisu tuleb andmebaasist.

   HINDU SIIN EI OLE. Admini väli on vabatekst ("3–4 h · 10–30 inimest ·
   alates 55 €/inimene") ja numbri väljanoppimine vabatekstist on hapram, kui
   asi väärt: rikastatud otsingutulemuses seisaks vale hind. Google'i nõue on
   ka, et struktuurandmed kirjeldaksid lehel NÄHTAVAT sisu — nimi ja kirjeldus
   seda teevad. Kui hinnad peaksid otsingusse jõudma, on vaja eraldi
   arvuvälju, mitte parsimist. */
export function buildHostEventJsonLd(messages, locale = "et") {
  const t = messages?.hostEvent;
  if (!t?.formats?.length) return null;

  const site = getPublicSiteUrl();
  const url = `${site}${locale === "en" ? "/en/sundmused" : "/sundmused"}#korralda`;
  const trim = (value) => String(value || "").replace(/\.$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: trim(t.heroTitle),
    serviceType: trim(t.formatsTitle),
    description: (t.heroText || []).join(" "),
    url,
    areaServed: { "@type": "Country", name: locale === "en" ? "Estonia" : "Eesti" },
    provider: {
      "@type": "Organization",
      name: messages.brand?.name,
      legalName: messages.brand?.company,
      url: site
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: trim(t.formatsTitle),
      itemListElement: t.formats.map((format) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: format.title,
          description: format.text
        }
      }))
    }
  };
}
