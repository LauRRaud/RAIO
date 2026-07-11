import type { Field, GlobalConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

const fontOptions = [
  { label: "Lehe vaikimisi font", value: "inherit" },
  { label: "RAIO / Posterama", value: "posterama" },
  { label: "Moodne süsteemifont", value: "system" },
  { label: "Arial · puhas ja neutraalne", value: "arial" },
  { label: "Helvetica · minimalistlik", value: "helvetica" },
  { label: "Verdana · hästi loetav", value: "verdana" },
  { label: "Trebuchet · pehme ja inimlik", value: "trebuchet" },
  { label: "Tahoma · kompaktne", value: "tahoma" },
  { label: "Georgia · ajakirjalik serif", value: "georgia" },
  { label: "Times · klassikaline serif", value: "times" },
  { label: "Garamond · elegantne serif", value: "garamond" },
  { label: "Palatino · soe serif", value: "palatino" },
  { label: "Courier New · kirjutusmasin", value: "courier" },
  { label: "Lucida Console · tehniline", value: "lucida" },
  { label: "Impact · tugev aktsent", value: "impact" }
];

function appearanceFields(prefix: string): Field[] {
  return [
    {
      name: `${prefix}BackgroundColor`,
      label: "Sektsiooni taustavärv",
      type: "text",
      admin: {
        description: "HEX, RGB või CSS värv, näiteks #11100d. Tühjaks jättes säilib praegune kujundus.",
        placeholder: "#f0e9dd",
        width: "50%"
      }
    },
    {
      name: `${prefix}TextColor`,
      label: "Teksti värv",
      type: "text",
      admin: {
        description: "Näiteks #11100d või white.",
        placeholder: "#11100d",
        width: "50%"
      }
    },
    {
      name: `${prefix}HeadingFont`,
      label: "Pealkirjade font",
      type: "select",
      defaultValue: "inherit",
      options: fontOptions,
      admin: { width: "50%" }
    },
    {
      name: `${prefix}BodyFont`,
      label: "Tekstide font",
      type: "select",
      defaultValue: "inherit",
      options: fontOptions,
      admin: { width: "50%" }
    }
  ];
}

function imageField(name: string, label = "Sektsiooni pilt"): Field {
  return { name, label, type: "upload", relationTo: "media" };
}

function textField(name: string, label: string, textarea = false): Field {
  if (textarea) {
    return { name, label, type: "textarea", localized: true };
  }
  return {
    name,
    label,
    type: "text",
    localized: true
  };
}

function sectionGroup(name: string, label: string, fields: Field[], description: string): Field {
  return {
    name,
    label,
    type: "group",
    admin: { description },
    fields: [...fields, ...appearanceFields("style")]
  };
}

const hero = (name: string, label = "01 · Header / hero") =>
  sectionGroup(
    name,
    label,
    [
      textField("eyebrow", "Väike ülatekst"),
      textField("title", "Pealkiri"),
      textField("accent", "Pealkirja rõhutatud osa"),
      textField("text", "Tekst (iga uus rida loob eraldi lõigu)", true),
      imageField("image", "Hero pilt"),
      imageField("mobileImage", "Hero pilt telefonis")
    ],
    "Lehe esimene sektsioon. Siin muudad pealkirja, teksti, pilti, värve ja fonte."
  );

export const PageEditor: GlobalConfig = {
  slug: "page-editor",
  label: "Lehtede sisu ja kujundus",
  access: { read: anyone, update: authenticated },
  admin: {
    group: "01 · MUUDA VEEBILEHTE",
    description: "Siin muudad lehti sektsioonide kaupa. Kõik väljad näitavad praegu avalikul lehel kasutatavat sisu. Alusta juhendist „Alusta siit · kasutusjuhend”."
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Menüü ja jalus",
          description: "Üle kogu veebilehe korduvad osad.",
          fields: [
            {
              name: "navigation",
              label: "Päisemenüü linginimed",
              type: "group",
              admin: { description: "Muudad ainult lingi nime. URL ja route jäävad alati samaks." },
              fields: [
                textField("trainings", "Treeningud · /treeningud"),
                textField("tools", "Vahendid · /vahendid"),
                textField("events", "Sündmused · /sundmused"),
                textField("shop", "Pood · /pood"),
                textField("about", "Meist · /meist"),
                textField("journal", "Journal · /journal")
              ]
            },
            sectionGroup(
              "footer",
              "Jalus",
              [
                textField("slogan", "Jaluse slogan"),
                textField("instagramLabel", "Instagrami lingi tekst"),
                { name: "instagramUrl", label: "Instagrami URL", type: "text" }
              ],
              "Kõigil lehtedel kuvatav jalus."
            )
          ]
        },
        {
          label: "Avaleht",
          fields: [
            hero("homeHero"),
            sectionGroup("homePhilosophy", "02 · Filosoofia", [textField("eyebrow", "Väike ülatekst"), textField("title", "Pealkiri"), textField("accent", "Rõhutatud osa"), textField("text", "Tekst", true), imageField("image")], "Avalehe teine, pildi ja tekstiga sektsioon."),
            sectionGroup("homeTools", "03 · Vahendid", [textField("eyebrow", "Väike ülatekst"), textField("title", "Pealkiri"), textField("accent", "Rõhutatud osa"), textField("text", "Tekst", true), imageField("image")], "Avalehe vahendite tutvustus."),
            {
              name: "homeCards",
              label: "04 · Avalehe suured lingikaardid",
              type: "array",
              localized: true,
              admin: { description: "Lisa, eemalda ja järjestage avalehe pildikaarte. Route vali loendist, et link jääks korrektseks." },
              fields: [
                { name: "route", label: "Sihtleht", type: "select", required: true, options: [
                  { label: "Treeningud", value: "/treeningud" }, { label: "Vahendid", value: "/vahendid" },
                  { label: "Sündmused", value: "/sundmused" }, { label: "Pood", value: "/pood" },
                  { label: "Meist", value: "/meist" }, { label: "Journal", value: "/journal" }
                ] },
                textField("title", "Pealkiri"), textField("subtitle", "Alapealkiri"), imageField("image", "Kaardi pilt")
              ]
            },
            sectionGroup("homeCardsStyle", "Kaartide sektsiooni kujundus", [], "Avalehe suurte kaartide taust, tekstivärv ja fondid.")
          ]
        },
        {
          label: "Treeningud",
          fields: [
            hero("trainingHero"),
            sectionGroup("trainingCarousel", "02 · Treeningute karussell", [
              textField("title", "Sektsiooni pealkiri"), textField("cta", "Kaardi nupu tekst"),
              { name: "qualities", label: "Kvaliteedimärksõnad", type: "array", localized: true, fields: [textField("title", "Tekst")] }
            ], "Kaarte lisad ja muudad vasakmenüüst „Treeningud”."),
            sectionGroup("trainingLasting", "03 · Kestev treening", [textField("title", "Pealkiri"), textField("text", "Tekst", true), textField("cta", "Nupu tekst"), imageField("image")], "Pildi ja tekstiga sisusektsioon."),
            sectionGroup("trainingWorkshop", "04 · Töötuba", [textField("title", "Pealkiri"), textField("text", "Tekst", true), textField("cta", "Nupu tekst")], "Treeningute lehe alumine üleskutse.")
          ]
        },
        {
          label: "Vahendid",
          fields: [
            hero("toolsHero"),
            sectionGroup("toolsCarousel", "02 · Vahendite karussell", [
              textField("title", "Sektsiooni pealkiri"), textField("cta", "Kaardi nupu tekst"),
              { name: "proofLabels", label: "Materjali sektsiooni märksõnad", type: "array", localized: true, fields: [textField("label", "Tekst")] }
            ], "Kaarte lisad ja muudad vasakmenüüst „Vahendite kaardid”."),
            sectionGroup("toolsMaterial", "03 · Materjal", [textField("title", "Pealkiri"), textField("text", "Tekst", true), imageField("image")], "Materjalide pildi- ja tekstisektsioon."),
            sectionGroup("toolsCare", "04 · Hooldus", [textField("title", "Pealkiri"), textField("text", "Tekst", true), imageField("image")], "Hoolduse pildi- ja tekstisektsioon.")
          ]
        },
        {
          label: "Sündmused",
          fields: [
            hero("eventsHero"),
            sectionGroup("eventsCarousel", "02 · Sündmuste karussell", [textField("title", "Sektsiooni pealkiri"), textField("cta", "Kaardi nupu tekst")], "Kaarte lisad ja muudad vasakmenüüst „Sündmused”."),
            sectionGroup("eventsHost", "03 · Korralda sündmus", [textField("title", "Pealkiri"), textField("text", "Tekst", true), textField("cta", "Nupu tekst"), imageField("image")], "Sündmuste lehe alumine pildi- ja tekstisektsioon.")
          ]
        },
        {
          label: "Pood",
          fields: [
            hero("shopHero"),
            sectionGroup("shopProducts", "02 · Toodete karussell", [textField("title", "Sektsiooni pealkiri")], "Tooteid lisad ja muudad vasakmenüüst „Tooted”."),
            sectionGroup("shopCustom", "03 · Eritellimus", [textField("title", "Pealkiri"), textField("text", "Tekst", true), textField("cta", "Nupu tekst"), imageField("image")], "Poe alumine eritellimuse sektsioon.")
          ]
        },
        {
          label: "Meist",
          fields: [
            hero("aboutHero"),
            sectionGroup("aboutStory", "02 · Meie lugu", [textField("title", "Pealkiri"), textField("text", "Tekst", true), imageField("image")], "Meie loo sektsioon."),
            sectionGroup("aboutTrainers", "03 · Treenerid", [
              textField("title", "Sektsiooni pealkiri"),
              { name: "items", label: "Treenerid", type: "array", localized: true, fields: [textField("name", "Nimi"), textField("text", "Tutvustus", true), imageField("image", "Treeneri pilt")] }
            ], "Lisa, eemalda või muuda treenerite kaarte."),
            sectionGroup("aboutClosing", "04 · Väärtused ja kontakt", [
              textField("title", "Pealkiri"),
              { name: "values", label: "Väärtused", type: "array", localized: true, fields: [textField("title", "Pealkiri"), textField("text", "Tekst", true)] },
              textField("contactTitle", "Kontaktiploki pealkiri"),
              textField("instagramLabel", "Instagrami lingi tekst")
            ], "Lehe alumine väärtuste ja kontaktide ala.")
          ]
        },
        {
          label: "Journal",
          fields: [
            hero("journalHero"),
            sectionGroup("journalCarousel", "02 · Artiklite karussell", [textField("title", "Sektsiooni pealkiri"), textField("cta", "Kaardi nupu tekst")], "Artikleid lisad ja muudad vasakmenüüst „Journal artiklid”."),
            sectionGroup("journalSignup", "03 · Alumine üleskutse", [textField("title", "Pealkiri"), textField("text", "Tekst", true), textField("cta", "Nupu tekst"), imageField("image")], "Journali alumine pildi- ja tekstisektsioon.")
          ]
        }
      ]
    }
  ]
};
