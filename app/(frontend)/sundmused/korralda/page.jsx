import { HostEventPage } from "@/components/pages/HostEventPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata("et", "hostEvent");
}
export const dynamic = "force-dynamic";

export default function KorraldaSundmus() {
  return <HostEventPage locale="et" />;
}
