import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PaymentResult } from "@/components/PaymentResult";
import { getHeaderTextures } from "@/lib/payloadContent";
import { getMessages } from "@/lib/messages";

export async function PaymentResultPage({ locale = "et", status = "pending", orderNumber = "" }) {
  const messages = getMessages(locale);

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header
        locale={locale}
        currentPath="/makse"
        labels={messages.header}
        brandName={messages.brand.name}
        textures={await getHeaderTextures()}
      />
      <main id="main">
        <PaymentResult
          locale={locale}
          status={status}
          orderNumber={orderNumber}
          labels={messages.payment}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
