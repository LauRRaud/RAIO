import { AboutPage } from "@/components/pages/AboutPage";
import { getPageMetadata } from "@/lib/messages";

export const metadata = getPageMetadata("et", "about");

export default function Meist() {
  return <AboutPage locale="et" />;
}
