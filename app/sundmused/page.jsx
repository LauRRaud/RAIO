import { EventsPage } from "@/components/pages/EventsPage";
import { getPageMetadata } from "@/lib/messages";

export const metadata = getPageMetadata("et", "events");

export default function Sundmused() {
  return <EventsPage locale="et" />;
}
