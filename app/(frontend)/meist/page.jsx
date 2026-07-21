import { AboutPage } from "@/components/pages/AboutPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("et", "about");
export const dynamic = "force-dynamic";

export default function Meist() {
  return <AboutPage locale="et" />;
}
