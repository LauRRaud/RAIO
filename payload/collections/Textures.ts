import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

/* Taustatekstuurid on OMA kollektsioon, mitte osa "media"-st, kahel põhjusel:

   1. Neil on eriline mõõdukomplekt — kaks maastikulaiust srcset'i jaoks ja üks
      PÜSTINE kärbe telefonile. Media alla pandud imageSizes genereeriks needsamad
      derivaadid ka igale tootepildile ja treeneri portreele, kus neid ei kasutata.
   2. Omanik peab nägema, milline tekstuur kus on, ja neid omavahel vahetama
      (omanik 2026-07-26). Media on `admin.hidden`, see kollektsioon ei ole —
      tekstuuridel on nüüd oma nähtav kogu.

   Mõõdud PEAVAD ühtima kaustavariante genereeriva scripts/texture-variants.mjs
   loogikaga (1200 + 1600 maastikku, 960x1600 püstine, webp q82), sest leht
   ühendab mõlemad allikad ühte srcset'i — vt lib/payloadContent.js
   uploadEntry/folderEntry. */
export const Textures: CollectionConfig = {
  slug: "textures",
  labels: {
    singular: "Taustatekstuur",
    plural: "Taustatekstuurid"
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated
  },
  admin: {
    group: "Sisu",
    useAsTitle: "alt",
    defaultColumns: ["alt", "category", "filename"],
    description:
      "Kõik sektsioonide taustapildid. Millises sektsioonis milline komplekt kasutusel on, valid „Taustaslaidid” alt."
  },
  upload: {
    staticDir: "public/media/taustad",
    mimeTypes: ["image/*"],
    /* Kõik uploadid normaliseeritakse webp q82 peale — sama otsus mis
       kaustapiltidel (vt scripts/texture-variants.mjs).

       q60 -> q82 (omanik 2026-07-27: "peamine sektsioon on roheline, mis ei ole
       piisavalt hea"). Mõõdetud: q60 sõi lähtefotolt 24–67% kõrgsagedusest ja
       ekraanil (1900 CSS px @ DPR 1.25) andis q82 tagasi +10…+51%. Suurem MÕÕT
       (2560/2800 px) EI aidanud — mõõtsin, vahe jäi alla 5% ja fail kahekordistus,
       sest lähtefotodel ei ole detaili nii kõrgel. Kadu oli seega kodeerimises,
       mitte skaleerimises. Ära vii tagasi allapoole 80. */
    formatOptions: { format: "webp", options: { quality: 82 } },
    imageSizes: [
      {
        /* Mõõdunimed on teadlikult numbrivabad. Payloadi veerunimede teisendus
           tekitab numbripiiril ebamäärasust (vt sama teisendaja tulem
           `thumbnail_u_r_l`), ja neid veerge tuleb selles repos käsitsi
           migratsiooni kirjutada — `payload migrate:create` on siinsel
           Windows/tsx seadistusel katki (ENOENT node:crypto?tsx-namespace=). */
        name: "medium",
        width: 1200,
        /* Väiksemat originaali ei venitata suuremaks — see annaks hägu ja
           valetaks srcset'is. Leht loeb srcset'i jaoks SALVESTATUD laiust,
           mitte siin soovitud mõõtu, nii et kärbitud variant ei eksita. */
        withoutEnlargement: true,
        formatOptions: { format: "webp", options: { quality: 82 } }
      },
      {
        name: "wide",
        width: 1600,
        withoutEnlargement: true,
        formatOptions: { format: "webp", options: { quality: 82 } }
      },
      {
        name: "portrait",
        /* Püstine kärbe, MITTE sama maastikupilt kitsamana: telefonibänd on
           ~390x700 ja object-fit: cover mahutab maastikufoto sinna kõrguse
           järgi, mistõttu nähtavasse aknasse jõuab ~446 lähtepikslit 1170
           nõutust (2.63x ülesskaleerimine). 960x1600 annab ~890 pikslit. */
        width: 960,
        height: 1600,
        fit: "cover",
        position: "centre",
        formatOptions: { format: "webp", options: { quality: 82 } }
      }
    ]
  },
  fields: [
    {
      name: "alt",
      label: "Nimi / alt tekst",
      type: "text",
      required: true,
      admin: {
        description:
          "Tekstuurid on dekoratiivsed (aria-hidden), seega see nimi on eelkõige sinu jaoks — nt „Terrakota kivisein 2”."
      }
    },
    {
      name: "sourcePath",
      label: "Algne kaustatee",
      type: "text",
      /* Impordi idempotentsuse võti: skript leiab selle järgi juba imporditud
         pildi üles ja ei tee duplikaati. Ühtlasi näitab, millisest kaustafailist
         tekstuur tuli. Tühi = admin'is käsitsi üles laaditud. */
      admin: {
        readOnly: true,
        description: "Täidab import (npm run textures:import). Tühi = admin'is käsitsi lisatud.",
        position: "sidebar"
      }
    },
    {
      name: "category",
      label: "Toonikomplekt",
      type: "select",
      /* Ainult sildistamiseks ja filtreerimiseks — seda, MIS kus kuvatakse,
         otsustab endiselt Taustaslaidid global. Kaks kohta oleks kaks tõde. */
      options: [
        { label: "Mustad / tumedad", value: "dark" },
        { label: "Hallid", value: "gray" },
        { label: "Heledad", value: "light" },
        { label: "Terrakota", value: "terracotta" },
        { label: "Rohelised", value: "green" }
      ],
      admin: {
        description:
          "Abisilt, et kogu jääks sirvitavaks. Kuvamise otsustab „Taustaslaidid”, mitte see väli."
      }
    }
  ]
};
