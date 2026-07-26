import { headers } from "next/headers";
import localFont from "next/font/local";
import { CartProvider } from "@/components/CartProvider";
import { JsonLd } from "@/components/JsonLd";
import { getMessages } from "@/lib/messages";
import { buildOrganizationJsonLd, getPublicSiteUrl } from "@/lib/seo";
import "./globals.css";

const display = localFont({
  src: "./fonts/Posterama-2001-W04-Regular.ttf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-display"
});

const messages = getMessages("et");

export const metadata = {
  metadataBase: new URL(getPublicSiteUrl()),
  title: messages.metadata.title,
  description: messages.metadata.description
};

metadata.icons = {
  icon: "/favicon.ico"
};

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
