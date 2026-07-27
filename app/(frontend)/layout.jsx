import { headers } from "next/headers";
import localFont from "next/font/local";
import { CartProvider } from "@/components/CartProvider";
import { JsonLd } from "@/components/JsonLd";
import { getMessages } from "@/lib/messages";
import { buildOrganizationJsonLd, buildSiteMetadata, getPublicSiteUrl } from "@/lib/seo";
import "./globals.css";

const display = localFont({
  src: "./fonts/Posterama-2001-W04-Regular.ttf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-display"
});

const messages = getMessages("et");

/* Google Search Console'i HTML-tag kinnitus — alternatiiv DNS TXT-kirjele.
   Tühja muutujaga ei lisata tagi üldse: pool-tühi verification-meta on
   Google'ile vigane signaal. */
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

/* Saidiülene vaikepealkiri tuleb admini SEO-globaalist (tühi väli = messages
   väärtus), seega ei saa see enam olla staatiline `export const metadata`. */
export async function generateMetadata() {
  const site = await buildSiteMetadata("et");

  return {
    metadataBase: new URL(getPublicSiteUrl()),
    title: site.title,
    description: site.description,
    icons: { icon: "/favicon.ico" },
    ...(googleVerification ? { verification: { google: googleVerification } } : {})
  };
}

/* Keel tuleb teelt, mille proxy.js päisesse paneb — /en lehed peavad
   teatama end inglise keelsena (Google'i keeletuvastus + ekraanilugejad). */
export default async function RootLayout({ children }) {
  const pathname = (await headers()).get("x-raio-pathname") || "/";
  const lang = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "et";

  return (
    <html lang={lang}>
      <body className={display.variable}>
        <JsonLd data={buildOrganizationJsonLd()} />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
