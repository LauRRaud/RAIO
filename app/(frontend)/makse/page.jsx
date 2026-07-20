import { PaymentResultPage } from "@/components/pages/PaymentResultPage";
import { getPageMetadata } from "@/lib/messages";

export const metadata = getPageMetadata("et", "payment");
export const dynamic = "force-dynamic";

export default async function Makse({ searchParams }) {
  const params = (await searchParams) || {};

  return <PaymentResultPage locale="et" status={params.status} orderNumber={params.order} />;
}
