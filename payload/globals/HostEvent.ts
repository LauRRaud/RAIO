import type { Field, GlobalConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

/* Sündmuste lehe "Korralda sündmus" bändi nupu taga olev MODAAL.
 *
 * MIKS OMA GLOBAAL, mitte uus tab "Lehtede sisu ja kujundus" all:
 * page_editor_locales oli juba 83 veeru peal ja Payload loeb lokaliseeritud
 * välju ühe `json_build_array(...)` kutsega, millel on Postgresis KÕVA
 * 100-argumendiline lagi. Selle sisu 23 välja viisid päringu üle piiri ja kogu
 * admin jäi veaga 54023 seisma. Oma tabel = oma lagi. Kui järgmine leht tuleb,
 * tee talle samamoodi oma globaal, ära kasva page_editor'i sisse.
 *
 * MIKS SIIN EI OLE VÄRVI-/FONDIVÄLJU (nagu page-editor'i sektsioonidel):
 * modaal ei ole sektsioon lehel, vaid jagab kroomi treeningu- ja sündmuse-
 * modaaliga (tume tekstuurtaust, hele tekst). Kui neid siin sättida saaks,
 * lagundaks see kolme modaali ühtsuse. Migratsioon 20260727_150000 lõi need
 * veerud enne, kui sisust modaal sai — need jäävad tabelisse kasutuseta,
 * andmeid seal ei ole ja Payload ei puutu neid.
 *
 * Formaate on kolm ja samme neli — kindlad kohad, mitte lisatavad read: modaal
 * on nende arvude peale kujundatud. Sõnalised järjenumbrid (formatOne…, mitte
 * format1…) sellepärast, et Payload teeb väljanimest veerunime ja number keset
 * nime annaks "format_1_title". */

function textField(name: string, label: string, textarea = false): Field {
  return textarea
    ? { name, label, type: "textarea", localized: true }
    : { name, label, type: "text", localized: true };
}

function group(name: string, label: string, fields: Field[], description: string): Field {
  return { name, label, type: "group", admin: { description }, fields };
}

export const HostEvent: GlobalConfig = {
  slug: "host-event",
  label: "Korralda sündmus · modaal",
  access: { read: anyone, update: authenticated },
  admin: {
    group: "01 · MUUDA VEEBILEHTE",
    description:
      "Aken, mis avaneb sündmuste lehe alumise bändi nupust. Tühjaks jäetud väli tähendab: jääb kehtima praegune tekst. Nupu enda teksti muudad „Lehtede sisu ja kujundus” → „Sündmused”."
  },
  fields: [
    group(
      "hero",
      "01 · Pealkiri ja sissejuhatus",
      [
        textField("title", "Pealkiri"),
        textField("text", "Tekst (iga uus rida loob eraldi lõigu)", true)
      ],
      "Modaali esimesed read."
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
      "Kolm plokki: mida sündmus üldse olla saab."
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
      "Modaali alumine plokk. Nupp viib kontaktideni lehel „Meist”."
    )
  ]
};
