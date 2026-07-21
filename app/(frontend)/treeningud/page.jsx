import { TrainingPage } from "@/components/pages/TrainingPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("et", "training");
export const dynamic = "force-dynamic";

export default function Treeningud() {
  return <TrainingPage locale="et" />;
}
