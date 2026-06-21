import { CartView } from "@/components/CartView";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getLocalizedPath } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export function CartPage({ locale = "et" }) {
  const messages = getMessages(locale);

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/ostukorv" labels={messages.header} brandName={messages.brand.name} />
      <main id="main">
        <CartView
          locale={locale}
          recipientEmail={messages.brand.email}
          shopHref={getLocalizedPath(locale, "/pood")}
          labels={messages.cart}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
