import { TrainingPage } from "@/components/pages/TrainingPage";
import { getPageMetadata } from "@/lib/messages";

export const metadata = getPageMetadata("et", "training");
export const dynamic = "force-dynamic";

export default function Treeningud() {
  return <TrainingPage locale="et" />;
}
