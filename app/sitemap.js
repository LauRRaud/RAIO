import { getPayloadProducts } from "@/lib/payloadContent";
import { getPublicSiteUrl, getSitemapToggles } from "@/lib/seo";

/* Nimekiri tuleb koodist, aga iga rea sees/väljas on admini otsus (globaal
   "seo" → Sitemap). Seepärast ei külmuta seda build'i ajal. */
export const dynamic = "force-dynamic";

/* Avalikud lehed mõlemas keeles. Ostukorv ja makse jäävad teadlikult välja
   (noindex, vt lib/seo.js) — sitemap'i kuuluvad ainult indekseeritavad lehed.
   `key` seob tee admini linnukesega. */
const PUBLIC_PATHS = [
  { key: "home", path: "/" },
  { key: "training", path: "/treeningud" },
  { key: "tools", path: "/vahendid" },
  { key: "events", path: "/sundmused" },
  { key: "journal", path: "/journal" },
  { key: "shop", path: "/pood" },
  { key: "about", path: "/meist" }
];

/* Tooted tulevad Payloadist, mitte lib/shop.js staatilisest loendist —
   admin'is lisatud toode peab sitemap'i jõudma ilma koodimuudatuseta.
   DB puudumisel langeb getPayloadProducts ise staatilisele vaikeväärtusele. */
export default async function sitemap() {
  const site = getPublicSiteUrl();
  const toEn = (path) => (path === "/" ? "/en" : `/en${path}`);
  const entry = (path, { priority, changeFrequency }) => ({
    url: `${site}${path === "/" ? "" : path}` || site,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        et: `${site}${path === "/" ? "" : path}` || site,
        en: `${site}${toEn(path)}`
      }
    }
  });

  const included = await getSitemapToggles();

  const pages = PUBLIC_PATHS.filter(({ key }) => included(key)).flatMap(({ path }) => {
    const opts = {
      priority: path === "/" ? 1 : path === "/pood" ? 0.9 : 0.7,
      changeFrequency: path === "/pood" ? "weekly" : "monthly"
    };
    return [entry(path, opts), { ...entry(path, opts), url: `${site}${toEn(path)}` }];
  });

  if (!included("products")) return pages;

  const catalog = await getPayloadProducts("et");
  const products = catalog
    .filter((product) => product.visible !== false)
    .flatMap((product) => {
      const path = `/pood/${product.slug}`;
      const opts = { priority: 0.8, changeFrequency: "weekly" };
      return [entry(path, opts), { ...entry(path, opts), url: `${site}${toEn(path)}` }];
    });

  return [...pages, ...products];
}
