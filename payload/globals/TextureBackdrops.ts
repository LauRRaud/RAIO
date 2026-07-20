import type { Field, GlobalConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

function textureSetField(name: string, label: string, description: string): Field {
  return {
    name,
    label,
    type: "upload",
    relationTo: "media",
    hasMany: true,
    admin: { description }
  };
}

/* Sektsioonide taustaslaidid (omanik 2026-07-20: "seda saab admin lehelt
   muuta"). Kui kategooria on siin tuhi, kasutab leht serveri kausta
   public/"RAIO taust"/<NN-kategooria> pilte — admin on ulekirjutuskiht. */
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
