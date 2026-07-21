import { getPublicSiteUrl } from "@/lib/seo";
import { shopProducts } from "@/lib/shop";

/* Avalikud lehed mõlemas keeles. Ostukorv ja makse jäävad teadlikult välja
   (noindex, vt lib/seo.js) — sitemap'i kuuluvad ainult indekseeritavad lehed. */
const PUBLIC_PATHS = [
  "/",
  "/treeningud",
  "/vahendid",
  "/sundmused",
  "/journal",
  "/pood",
  "/meist"
];

export default function sitemap() {
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

  const pages = PUBLIC_PATHS.flatMap((path) => {
    const opts = {
      priority: path === "/" ? 1 : path === "/pood" ? 0.9 : 0.7,
      changeFrequency: path === "/pood" ? "weekly" : "monthly"
    };
    return [entry(path, opts), { ...entry(path, opts), url: `${site}${toEn(path)}` }];
  });

  const products = shopProducts
    .filter((product) => product.visible !== false)
    .flatMap((product) => {
      const path = `/pood/${product.slug}`;
      const opts = { priority: 0.8, changeFrequency: "weekly" };
      return [entry(path, opts), { ...entry(path, opts), url: `${site}${toEn(path)}` }];
    });

  return [...pages, ...products];
}
