import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getMessages } from "@/lib/messages";

export function ContactPage({ locale = "et" }) {
  const messages = getMessages(locale);
  const t = messages.contact;
  const email = messages.brand.email;

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.skipLink}
      </a>
      <Header locale={locale} currentPath="/kontakt" />
      <main id="main">
        <section className="contact-simple section">
          <div className="container contact-simple-inner">
            <div className="contact-copy">
              <p className="contact-eyebrow">{t.eyebrow}</p>
              <h1 className="contact-title">{t.title}</h1>
              <p className="contact-simple-copy">{t.description}</p>
            </div>

            <aside className="contact-panel" aria-label={t.panelLabel}>
              <p className="contact-panel-kicker">{t.panelKicker}</p>
              <a className="contact-email" href={`mailto:${email}`}>
                {email}
              </a>
              <p className="contact-response">{t.response}</p>

              <div className="contact-topic-list">
                {t.topics.map((topic) => (
                  <div className="contact-topic" key={topic.title}>
                    <span>{topic.title}</span>
                    <p>{topic.text}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
