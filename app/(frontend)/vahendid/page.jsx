import { ToolsPage } from "@/components/pages/ToolsPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("et", "tools");
export const dynamic = "force-dynamic";

export default function Vahendid() {
  return <ToolsPage locale="et" />;
}
