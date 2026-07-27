import { HomePage } from "@/components/HomePage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata("et", "home");
}
export const dynamic = "force-dynamic";

export default function Home() {
  return <HomePage locale="et" />;
}
