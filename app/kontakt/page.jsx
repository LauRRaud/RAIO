import { ContactPage } from "@/components/pages/ContactPage";
import { getPageMetadata } from "@/lib/messages";

export const metadata = getPageMetadata("et", "contact");

export default function Kontakt() {
  return <ContactPage locale="et" />;
}
