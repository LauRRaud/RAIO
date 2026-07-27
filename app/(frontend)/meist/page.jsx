import { AboutPage } from "@/components/pages/AboutPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata("et", "about");
}
export const dynamic = "force-dynamic";

export default function Meist() {
  return <AboutPage locale="et" />;
}
