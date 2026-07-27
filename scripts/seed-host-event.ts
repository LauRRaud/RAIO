// @ts-nocheck -- data bridge: messages/*.json -> Payload "host-event" global
//
// Kaks tööd:
//  1. Täidab modaali admini väljad praeguste avalike tekstidega, et omanik
//     näeks vormil seda, mis päriselt lehel on.
//  2. Uuendab MÕLEMA modaali avava bändi nupu teksti ("Võta ühendust" ->
//     "Vaata võimalusi") — sündmuste lehe eventsHost ja treeningute lehe
//     trainingWorkshop. Need elavad page-editor'i andmebaasis ja
//     messages/*.json muutmine ei jõua sinna. Puutumata jääb nupp, mille
//     omanik on ise juba millekski muuks kirjutanud.
//
// Kasutus:  npm run seed:host-event        (lokaalselt või serveris)
//           npm run seed:host-event -- --force
import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import { getPayload } from "payload";

const root = process.cwd();
const { loadEnvConfig } = nextEnv;
loadEnvConfig(root);

const { default: config } = await import("../payload.config");
const payload = await getPayload({ config });

const messages = {
  et: JSON.parse(fs.readFileSync(path.join(root, "messages", "et.json"), "utf8")),
  en: JSON.parse(fs.readFileSync(path.join(root, "messages", "en.json"), "utf8"))
};

const force = process.argv.includes("--force");

/* Vana vaikeväärtus mõlemas keeles — ainult neid kirjutame üle. */
const OLD_CTA = ["Võta ühendust", "Get in touch"];

async function seedHostEvent(locale: "et" | "en") {
  /* fallbackLocale: false — muidu tagastaks inglise päring eesti väärtused ja
     skript arvaks, et inglise väljad on juba täidetud. */
  const current = await payload.findGlobal({ slug: "host-event", locale, depth: 0, fallbackLocale: false });
  const t = messages[locale].hostEvent;

  const filled = current?.hero?.title && current?.formats?.title && current?.process?.title;
  if (filled && !force) {
    console.log(`${locale}: host-event juba täidetud, jätan vahele`);
    return;
  }

  const keep = (existing: string | undefined, fallback: string) => (force ? fallback : existing || fallback);

  await payload.updateGlobal({
    slug: "host-event",
    locale,
    overrideAccess: true,
    data: {
      hero: {
        ...(current?.hero || {}),
        title: keep(current?.hero?.title, t.heroTitle),
        text: keep(current?.hero?.text, t.heroText.join("\n"))
      },
      formats: {
        ...(current?.formats || {}),
        title: keep(current?.formats?.title, t.formatsTitle),
        formatOneTitle: keep(current?.formats?.formatOneTitle, t.formats[0].title),
        formatOneText: keep(current?.formats?.formatOneText, t.formats[0].text),
        formatOneMeta: keep(current?.formats?.formatOneMeta, t.formats[0].meta),
        formatTwoTitle: keep(current?.formats?.formatTwoTitle, t.formats[1].title),
        formatTwoText: keep(current?.formats?.formatTwoText, t.formats[1].text),
        formatTwoMeta: keep(current?.formats?.formatTwoMeta, t.formats[1].meta),
        formatThreeTitle: keep(current?.formats?.formatThreeTitle, t.formats[2].title),
        formatThreeText: keep(current?.formats?.formatThreeText, t.formats[2].text),
        formatThreeMeta: keep(current?.formats?.formatThreeMeta, t.formats[2].meta)
      },
      process: {
        ...(current?.process || {}),
        title: keep(current?.process?.title, t.processTitle),
        stepOneTitle: keep(current?.process?.stepOneTitle, t.steps[0].title),
        stepOneText: keep(current?.process?.stepOneText, t.steps[0].text),
        stepTwoTitle: keep(current?.process?.stepTwoTitle, t.steps[1].title),
        stepTwoText: keep(current?.process?.stepTwoText, t.steps[1].text),
        stepThreeTitle: keep(current?.process?.stepThreeTitle, t.steps[2].title),
        stepThreeText: keep(current?.process?.stepThreeText, t.steps[2].text),
        stepFourTitle: keep(current?.process?.stepFourTitle, t.steps[3].title),
        stepFourText: keep(current?.process?.stepFourText, t.steps[3].text),
        notesTitle: keep(current?.process?.notesTitle, t.notesTitle),
        notes: keep(current?.process?.notes, t.notes.join("\n"))
      },
      closing: {
        ...(current?.closing || {}),
        title: keep(current?.closing?.title, t.closingTitle),
        text: keep(current?.closing?.text, t.closingText),
        cta: keep(current?.closing?.cta, t.closingCta)
      }
    }
  });

  console.log(`${locale}: host-event täidetud`);
}

/* Mõlemad modaali avavad bändid: sündmuste leht ja treeningute leht. */
const BANDS = [
  { section: "eventsHost", label: "sündmuste bänd", wanted: (m) => m.events.host.cta },
  { section: "trainingWorkshop", label: "treeningute bänd", wanted: (m) => m.training.workshop.cta }
];

async function updateBandCta(locale: "et" | "en") {
  const current = await payload.findGlobal({ slug: "page-editor", locale, depth: 0, fallbackLocale: false });

  for (const band of BANDS) {
    const existing = current?.[band.section]?.cta;
    const wanted = band.wanted(messages[locale]);

    if (existing && !OLD_CTA.includes(existing) && !force) {
      console.log(`${locale}: ${band.label} on omaniku oma ("${existing}"), ei puutu`);
      continue;
    }
    if (existing === wanted) {
      console.log(`${locale}: ${band.label} juba "${wanted}"`);
      continue;
    }

    await payload.updateGlobal({
      slug: "page-editor",
      locale,
      overrideAccess: true,
      data: { [band.section]: { ...(current?.[band.section] || {}), cta: wanted } }
    });
    console.log(`${locale}: ${band.label} "${existing || "(tühi)"}" -> "${wanted}"`);
  }
}

for (const locale of ["et", "en"] as const) {
  await seedHostEvent(locale);
  await updateBandCta(locale);
}

console.log("Valmis.");
process.exit(0);
