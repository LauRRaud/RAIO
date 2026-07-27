import type { Field, GlobalConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

/* Alaleht /sundmused/korralda.
 *
 * MIKS OMA GLOBAAL, mitte uus tab "Lehtede sisu ja kujundus" all:
 * page_editor_locales oli juba 83 veeru peal ja Payload loeb lokaliseeritud
 * välju ühe `json_build_array(...)` kutsega, millel on Postgresis KÕVA
 * 100-argumendiline lagi. Selle lehe 23 välja viisid päringu üle piiri ja kogu
 * admin jäi veaga 54023 seisma. Oma tabel = oma lagi. Kui järgmine leht tuleb,
 * tee talle samamoodi oma globaal, ära kasva page_editor'i sisse.
 *
 * Formaate on kolm ja samme neli — kindlad kohad, mitte lisatavad read: leht
 * on nende arvude peale kujundatud. Sõnalised järjenumbrid (formatOne…, mitte
 * format1…) sellepärast, et Payload teeb väljanimest veerunime ja number keset
 * nime annaks "format_1_title". */

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

const textScaleOptions = [
  { label: "Väiksem (90%)", value: "0.9" },
  { label: "Vaikimisi (100%)", value: "1" },
  { label: "Veidi suurem (110%)", value: "1.1" },
  { label: "Suurem (125%)", value: "1.25" },
  { label: "Kõige suurem (150%)", value: "1.5" }
];

function appearanceFields(): Field[] {
  return [
    {
      name: "styleBackgroundColor",
      label: "Sektsiooni taustavärv",
      type: "text",
      admin: { description: "HEX, RGB või CSS värv. Tühjaks jättes säilib praegune kujundus.", width: "50%" }
    },
    {
      name: "styleTextColor",
      label: "Teksti värv",
      type: "text",
      admin: { description: "Näiteks #11100d või white.", width: "50%" }
    },
    { name: "styleHeadingFont", label: "Pealkirjade font", type: "select", defaultValue: "inherit", options: fontOptions, admin: { width: "50%" } },
    { name: "styleBodyFont", label: "Tekstide font", type: "select", defaultValue: "inherit", options: fontOptions, admin: { width: "50%" } },
    { name: "styleTextScale", label: "Tekstide suurus", type: "select", defaultValue: "1", options: textScaleOptions, admin: { width: "50%" } }
  ];
}

function textField(name: string, label: string, textarea = false): Field {
  return textarea
    ? { name, label, type: "textarea", localized: true }
    : { name, label, type: "text", localized: true };
}

function group(name: string, label: string, fields: Field[], description: string): Field {
  return { name, label, type: "group", admin: { description }, fields: [...fields, ...appearanceFields()] };
}

export const HostEvent: GlobalConfig = {
  slug: "host-event",
  label: "Korralda sündmus · alaleht",
  access: { read: anyone, update: authenticated },
  admin: {
    group: "01 · MUUDA VEEBILEHTE",
    description:
      "Alaleht raio.ee/sundmused/korralda, kuhu viib sündmuste lehe nupp. Tühjaks jäetud väli tähendab: jääb kehtima praegune tekst."
  },
  fields: [
    group(
      "hero",
      "01 · Header / hero",
      [
        textField("title", "Pealkiri"),
        textField("text", "Tekst (iga uus rida loob eraldi lõigu)", true),
        { name: "image", label: "Hero pilt", type: "upload", relationTo: "media" },
        { name: "mobileImage", label: "Hero pilt telefonis", type: "upload", relationTo: "media" }
      ],
      "Lehe esimene sektsioon."
    ),
    group(
      "formats",
      "02 · Formaadid",
      [
        textField("title", "Sektsiooni pealkiri"),
        textField("formatOneTitle", "1. formaadi pealkiri"),
        textField("formatOneText", "1. formaadi tekst", true),
        textField("formatTwoTitle", "2. formaadi pealkiri"),
        textField("formatTwoText", "2. formaadi tekst", true),
        textField("formatThreeTitle", "3. formaadi pealkiri"),
        textField("formatThreeText", "3. formaadi tekst", true)
      ],
      "Kolm kaarti: mida sündmus üldse olla saab."
    ),
    group(
      "process",
      "03 · Kuidas see käib",
      [
        textField("title", "Sektsiooni pealkiri"),
        textField("stepOneTitle", "1. sammu pealkiri"),
        textField("stepOneText", "1. sammu tekst", true),
        textField("stepTwoTitle", "2. sammu pealkiri"),
        textField("stepTwoText", "2. sammu tekst", true),
        textField("stepThreeTitle", "3. sammu pealkiri"),
        textField("stepThreeText", "3. sammu tekst", true),
        textField("stepFourTitle", "4. sammu pealkiri"),
        textField("stepFourText", "4. sammu tekst", true),
        textField("notesTitle", "„Hea teada” pealkiri"),
        textField("notes", "„Hea teada” punktid (iga uus rida = uus punkt)", true)
      ],
      "Neli sammu kirjast sündmuseni ja nende all lühike „hea teada” loend."
    ),
    group(
      "closing",
      "04 · Lõpetav üleskutse",
      [textField("title", "Pealkiri"), textField("text", "Tekst", true), textField("cta", "Nupu tekst")],
      "Lehe alumine plokk. Nupp viib kontaktideni lehel „Meist”."
    )
  ]
};
