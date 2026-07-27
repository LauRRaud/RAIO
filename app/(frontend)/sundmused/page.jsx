import { EventsPage } from "@/components/pages/EventsPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata("et", "events");
}
export const dynamic = "force-dynamic";

export default function Sundmused() {
  return <EventsPage locale="et" />;
}
