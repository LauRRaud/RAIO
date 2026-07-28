import type { Field, GlobalConfig } from "payload";

import en from "@/messages/en.json";
import et from "@/messages/et.json";
import { anyone, authenticated } from "@/payload/access";

/* SEO-tekstid ja otsingumootorite seaded admini alt.
 *
 * Kõik väljad on VABATAHTLIKUD: tühi väli tähendab "jäta nii, nagu koodis on"
 * (messages/et.json + messages/en.json). Nii ei saa admin kogemata tühja
 * pealkirja avalikule lehele saata — vt lib/seo.js pickText().
 *
 * robots.txt ei ole siin vaba tekstiväli: üks vale rida seal kustutab terve
 * saidi Google'ist. Selle asemel on nimetatud lülitid ja kontrollitud
 * keeluridade loend (validate allpool). */

const seoPages = [
  { name: "home", label: "Avaleht · raio.ee/" },
  { name: "training", label: "Treeningud · /treeningud" },
  { name: "tools", label: "Vahendid · /vahendid" },
  { name: "events", label: "Sündmused · /sundmused" },
  { name: "journal", label: "RA•IO+ · /journal" },
  { name: "shop", label: "Pood · /pood" },
  { name: "about", label: "Meist · /meist" }
] as const;

/* Tühi väli tähendab "kasuta koodi teksti" — aga tühjast lahtrist ei näe,
   MILLINE tekst see on (omanik 2026-07-27: "kuidas ma näen praegust teksti,
   mille sõnastust muuta, kui seal on tühi väli?"). Seepärast kirjutame
   messages/*.json väärtuse välja kirjeldusse, mõlemas keeles korraga:
   admini Locale-lüliti ei ole väljakirjeldustele kättesaadav, ja niikuinii on
   kasulik näha, mis teises keeles seisab. Kirjeldus loetakse koodifailist,
   seega ta ei saa DB-ga lahku minna. */
function currentText(key: "title" | "description", pageKey?: string): string {
  const pick = (catalog: Record<string, any>) =>
    (pageKey ? catalog[pageKey]?.metadata : catalog.metadata)?.[key] || "—";

  /* Reavahetused ei jõua kirjelduseni (Payload renderdab teksti ühte diivi ja
     HTML sööb \n ära), seega eraldajad on nähtavad märgid. */
  return `Tühjaks jättes jääb kehtima praegune tekst — ET: „${pick(et)}” · EN: „${pick(en)}”`;
}

function pageSeoGroup(name: string, label: string): Field {
  return {
    name,
    label,
    type: "group",
    admin: {
      description:
        "Eesti ja inglise sisu vahetad paremal üleval Locale valikust. Iga välja all on kirjas, mis tekst tühja välja korral kehtima jääb."
    },
    fields: [
      {
        name: "title",
        label: "Pealkiri (Google'i sinine rida + brauseri sakk)",
        type: "text",
        localized: true,
        admin: {
          description: `Kuni umbes 60 märki, muidu Google lõikab lõpu ära. ${currentText("title", name)}`
        }
      },
      {
        name: "description",
        label: "Kirjeldus (hall tekst Google'i tulemuse all)",
        type: "textarea",
        localized: true,
        admin: {
          description: `Soovituslik 120–155 märki. Ei mõjuta pingerida, mõjutab seda, kas inimene klikib. ${currentText("description", name)}`
        }
      },
      {
        name: "shareImage",
        label: "Jagamispilt (Facebook, WhatsApp, LinkedIn)",
        type: "upload",
        relationTo: "media",
        /* Kaardil seisab lehe nimi pildi peal ("SÜNDMUSED" / "EVENTS"), seega
           see on avalik tekst ja käib mõlemas keeles (CLAUDE.md). */
        localized: true,
        admin: {
          description:
            "Eesti ja inglise pilti vahetad paremal üleval Locale valikust — kaardil on lehe nimi pildi peal. Soovituslik 1200×630 pikslit. Tühjaks jättes kasutatakse üldist jagamispilti („Jagamispilt ja vaikeväärtused” kaardilt)."
        }
      }
    ]
  };
}

/* Iga rida peab olema tee, mis algab kaldkriipsuga. "/" üksinda keelaks kogu
   saidi — see on kõige kallim võimalik näpuviga, seega blokeerime salvestamise. */
function validateDisallowLines(value: unknown): true | string {
  if (!value) return true;

  const lines = String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (line === "/") {
      return "Rida „/” keelaks kogu veebilehe Google'is. Kirjuta konkreetne tee, näiteks /ostukorv.";
    }
    if (!line.startsWith("/")) {
      return `Iga rida peab algama kaldkriipsuga. Vigane rida: „${line}”`;
    }
    if (/\s/.test(line)) {
      return `Reas ei tohi olla tühikuid. Vigane rida: „${line}”`;
    }
  }

  return true;
}

function sitemapToggle(name: string, label: string): Field {
  return {
    name,
    label,
    type: "checkbox",
    defaultValue: true,
    admin: { width: "50%" }
  };
}

export const Seo: GlobalConfig = {
  slug: "seo",
  label: "SEO · Google ja jagamine",
  access: {
    read: anyone,
    update: authenticated
  },
  admin: {
    group: "02 · SEADED",
    description:
      "Siin muudad, mida Google ja Facebook sinu lehtedest näitavad. Muudatus jõustub kohe pärast Save — deploy'd pole vaja."
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Lehtede tekstid",
          description:
            "Iga lehe pealkiri ja kirjeldus otsingutulemuses. Tühi väli = praegune tekst jääb kehtima.",
          fields: [
            {
              name: "site",
              label: "Kogu saidi vaikeväärtus",
              type: "group",
              admin: {
                description:
                  "Kasutatakse ainult siis, kui lehel endal pealkirja pole. Tavaliselt ei ole vaja puutuda."
              },
              fields: [
                {
                  name: "title",
                  label: "Vaikimisi pealkiri",
                  type: "text",
                  localized: true,
                  admin: { description: currentText("title") }
                },
                {
                  name: "description",
                  label: "Vaikimisi kirjeldus",
                  type: "textarea",
                  localized: true,
                  admin: { description: currentText("description") }
                }
              ]
            },
            ...seoPages.map((page) => pageSeoGroup(page.name, page.label))
          ]
        },
        {
          label: "Jagamispilt ja vaikeväärtused",
          description:
            "Pilt, mis ilmub siis, kui keegi jagab linki Facebookis, WhatsAppis, LinkedInis või Slackis.",
          fields: [
            {
              name: "defaultShareImage",
              label: "Üldine jagamispilt",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Kehtib kõigil lehtedel, millel pole oma jagamispilti. Soovituslik 1200×630 pikslit. Tühjaks jättes kasutatakse faili /og/og-default.jpg."
              }
            }
          ]
        },
        {
          label: "robots.txt",
          description:
            "robots.txt ütleb otsingurobotitele, mida nad tohivad läbi lugeda. Vaata tulemust: raio.ee/robots.txt",
          fields: [
            {
              name: "robots",
              label: "Robotite reeglid",
              type: "group",
              admin: {
                description:
                  "Google, Bing jt saavad kogu avaliku saidi lugeda. Alati on keelatud /admin ja /api/ — neid ei saa siit sisse lülitada."
              },
              fields: [
                {
                  name: "allowAiBots",
                  label: "Luba tehisintellekti robotitel sisu lugeda",
                  type: "checkbox",
                  defaultValue: true,
                  admin: {
                    description:
                      "Puudutab ChatGPT-d, Claude'i, Perplexityt jt. Sees = RA•IO sisu võib jõuda AI-vestlustesse (nähtavus). Väljas = sinu tekstid ja fotod jäävad mudelitest välja. Google'i tavaotsingut see valik EI mõjuta."
                  }
                },
                {
                  name: "extraDisallow",
                  label: "Lisaks keelatud teed (üks rida = üks tee)",
                  type: "textarea",
                  validate: validateDisallowLines,
                  admin: {
                    description:
                      "Näiteks /ostukorv. Iga rida peab algama kaldkriipsuga. Tavaliselt jäta tühjaks — ostukorv ja makse on niigi otsingust väljas.",
                    placeholder: "/mingi-leht"
                  }
                }
              ]
            }
          ]
        },
        {
          label: "Sitemap",
          description:
            "Sitemap on lehtede nimekiri, mille anname Google'ile. Vaata tulemust: raio.ee/sitemap.xml",
          fields: [
            {
              name: "sitemap",
              label: "Millised lehed sitemap'i kuuluvad",
              type: "group",
              admin: {
                description:
                  "Linnuke maha = leht kaob nimekirjast. NB! See ei kustuta lehte Google'ist, ainult lõpetab selle soovitamise. Ostukorv ja makse ei ole nimekirjas kunagi."
              },
              fields: [
                sitemapToggle("home", "Avaleht"),
                sitemapToggle("training", "Treeningud"),
                sitemapToggle("tools", "Vahendid"),
                sitemapToggle("events", "Sündmused"),
                sitemapToggle("journal", "RA•IO+ / journal"),
                sitemapToggle("shop", "Pood"),
                sitemapToggle("about", "Meist"),
                sitemapToggle("products", "Tootelehed (kõik nähtavad tooted)")
              ]
            }
          ]
        }
      ]
    }
  ]
};
