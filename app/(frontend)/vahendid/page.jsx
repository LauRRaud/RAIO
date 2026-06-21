import { ToolsPage } from "@/components/pages/ToolsPage";
import { getPageMetadata } from "@/lib/messages";

export const metadata = getPageMetadata("et", "tools");
export const dynamic = "force-dynamic";

export default function Vahendid() {
  return <ToolsPage locale="et" />;
}
