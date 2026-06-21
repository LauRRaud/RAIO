import { HomePage } from "@/components/HomePage";
import { getHomeMetadata } from "@/lib/messages";

export const metadata = getHomeMetadata("et");

export default function Home() {
  return <HomePage locale="et" />;
}
