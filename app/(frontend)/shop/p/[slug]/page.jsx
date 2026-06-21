import { redirect } from "next/navigation";

export default async function LegacyProductRedirect({ params }) {
  const { slug } = await params;
  redirect(`/pood/${slug}`);
}
