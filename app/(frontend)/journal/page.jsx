import { JournalPage } from "@/components/pages/JournalPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata("et", "journal");
}
export const dynamic = "force-dynamic";

export default function Journal() {
  return <JournalPage locale="et" />;
}
