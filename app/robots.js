import { buildRobots } from "@/lib/seo";

/* Sisu tuleb admini globaalist "seo" (lülitid, mitte vaba tekst — üks vale
   rida robots.txt-is kustutaks saidi Google'ist). Seepärast ei tohi seda
   build'i ajal külmutada: omanik ootab, et Save mõjuks kohe. */
export const dynamic = "force-dynamic";

export default async function robots() {
  return buildRobots();
}
