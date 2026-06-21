import { ToolsPage } from "@/components/pages/ToolsPage";
import { getPageMetadata } from "@/lib/messages";

export const metadata = getPageMetadata("et", "tools");

export default function Vahendid() {
  return <ToolsPage locale="et" />;
}
