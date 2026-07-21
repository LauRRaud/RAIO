import { getPublicSiteUrl } from "@/lib/seo";

export default function robots() {
  const site = getPublicSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/ostukorv", "/makse", "/en/ostukorv", "/en/makse"]
      }
    ],
    sitemap: `${site}/sitemap.xml`
  };
}
