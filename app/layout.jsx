import localFont from "next/font/local";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

const display = localFont({
  src: "./fonts/Posterama-2001-W04-Regular.ttf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-display"
});

export const metadata = {
  title: "RA•IO",
  description: "RA•IO koduleht, pood ja kogemuste platvorm"
};

metadata.icons = {
  icon: "/favicon.ico"
};

export default function RootLayout({ children }) {
  return (
    <html lang="et" data-scroll-behavior="smooth">
      <body className={display.variable}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
