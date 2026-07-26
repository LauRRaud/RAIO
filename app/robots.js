import { getPublicSiteUrl } from "@/lib/seo";

export default function robots() {
  const site = getPublicSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* Ostukorv ja makse EI ole siin: neil on lehe peal noindex (vt
           lib/seo.js NOINDEX_PAGES). Crawl'i keelamine takistaks robotil
           seda noindex'it lugeda — leht võiks välislingi kaudu ikka
           indeksisse sattuda. Üks signaal, mitte kaks vastuolulist. */
        disallow: ["/admin", "/api/"]
      }
    ],
    sitemap: `${site}/sitemap.xml`
  };
}
