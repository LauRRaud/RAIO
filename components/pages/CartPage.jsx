import { CartView } from "@/components/CartView";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getHeaderTextures, getSectionTextures } from "@/lib/payloadContent";
import { getLocalizedPath } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export async function CartPage({ locale = "et" }) {
  const messages = getMessages(locale);

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/ostukorv" labels={messages.header} brandName={messages.brand.name} textures={await getHeaderTextures()} />
      <main id="main">
        <CartView
          locale={locale}
          shopHref={getLocalizedPath(locale, "/pood")}
          labels={messages.cart}
          /* Halli kivi tekstuur ka ostukorvi sektsioonile (omanik 2026-07-20).
             CartView on "use client", nii et pildid tulevad propina. */
          textures={await getSectionTextures("gray")}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
