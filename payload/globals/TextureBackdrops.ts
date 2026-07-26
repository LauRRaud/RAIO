import type { Field, GlobalConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

function textureSetField(name: string, label: string, description: string): Field {
  return {
    name,
    label,
    /* relationTo: "textures", MITTE "media" — tekstuuridel on oma kollektsioon
       koos püstkärpe ja srcset-mõõtudega (payload/collections/Textures.ts).
       Vahetus oli ohutu, sest need viis välja olid kõik tühjad. */
    type: "upload",
    relationTo: "textures",
    hasMany: true,
    admin: { description }
  };
}

/* Sektsioonide taustaslaidid (omanik 2026-07-20: "seda saab admin lehelt
   muuta"). Pildid imporditi kaustast kollektsiooni 2026-07-26, seega admin on
   nüüd ALLIKAS: siin lohistad järjekorda, vahetad tekstuure komplektide vahel
   ja lisad uusi. Kaust public/"RAIO taust" jääb varuvariandiks tühja
   kategooria jaoks — nii ei jää sektsioon kunagi taustata, kui keegi kogemata
   komplekti tühjaks teeb. Import: npm run textures:import. */
export const TextureBackdrops: GlobalConfig = {
  slug: "texture-backdrops",
  label: "Taustaslaidid",
  access: {
    read: anyone,
    update: authenticated
  },
  admin: {
    group: "Sisu",
    description:
      "Sektsioonide taustapiltide slaidiseanss. Kui kategooria on tuhi, kasutatakse serveri kausta (public/RAIO taust) pilte. Jarjekorda saab lohistades muuta."
  },
  fields: [
    {
      name: "interval",
      label: "Slaidi vahetus (sekundites)",
      type: "number",
      defaultValue: 20,
      min: 5,
      max: 120,
      admin: { description: "Mitme sekundi jarel taustapilt vahetub. Uks pilt kategoorias = staatiline taust." }
    },
    textureSetField("dark", "Mustad / tumedad", "Hero-sektsioonide taustad koigil lehtedel."),
    textureSetField("gray", "Hallid", "Hallid sektsioonid: MIKS PUU JA KIVI, treenerid, kestev treening."),
    textureSetField("light", "Heledad", "Paise menuu ja jaluse taust."),
    textureSetField("terracotta", "Terrakota", "Viimane sektsioon enne jalust; Meie lugu; avalehe vahendite sektsioon."),
    textureSetField("green", "Rohelised", "Scrollitavad karussellisektsioonid; avalehe filosoofia.")
  ]
};
