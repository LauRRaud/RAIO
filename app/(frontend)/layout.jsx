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

export default function RootLayout({ children }) {
  return (
    <html lang="et" data-scroll-behavior="smooth">
      <body className={display.variable}>
        <JsonLd data={buildOrganizationJsonLd()} />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
