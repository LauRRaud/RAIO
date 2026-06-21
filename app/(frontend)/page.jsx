import { HomePage } from "@/components/HomePage";
import { getHomeMetadata } from "@/lib/messages";

export const metadata = getHomeMetadata("et");
export const dynamic = "force-dynamic";

export default function Home() {
  return <HomePage locale="et" />;
}
