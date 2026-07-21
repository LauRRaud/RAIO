import { HomePage } from "@/components/HomePage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("et", "home");
export const dynamic = "force-dynamic";

export default function Home() {
  return <HomePage locale="et" />;
}
