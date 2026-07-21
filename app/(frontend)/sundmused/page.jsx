import { EventsPage } from "@/components/pages/EventsPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("et", "events");
export const dynamic = "force-dynamic";

export default function Sundmused() {
  return <EventsPage locale="et" />;
}
