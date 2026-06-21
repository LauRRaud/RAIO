import { JournalPage } from "@/components/pages/JournalPage";
import { getPageMetadata } from "@/lib/messages";

export const metadata = getPageMetadata("et", "journal");
export const dynamic = "force-dynamic";

export default function Journal() {
  return <JournalPage locale="et" />;
}
