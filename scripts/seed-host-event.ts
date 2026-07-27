// @ts-nocheck -- data bridge: messages/*.json -> Payload "host-event" global
//
// Kaks tööd:
//  1. Täidab alalehe /sundmused/korralda admini väljad praeguste avalike
//     tekstidega, et omanik näeks vormil seda, mis päriselt lehel on.
//  2. Uuendab sündmuste lehe bändi nupu teksti ("Võta ühendust" ->
//     "Vaata võimalusi"), sest see elab page-editor'i andmebaasis ja
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
        formatTwoTitle: keep(current?.formats?.formatTwoTitle, t.formats[1].title),
        formatTwoText: keep(current?.formats?.formatTwoText, t.formats[1].text),
        formatThreeTitle: keep(current?.formats?.formatThreeTitle, t.formats[2].title),
        formatThreeText: keep(current?.formats?.formatThreeText, t.formats[2].text)
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

async function updateBandCta(locale: "et" | "en") {
  const current = await payload.findGlobal({ slug: "page-editor", locale, depth: 0, fallbackLocale: false });
  const existing = current?.eventsHost?.cta;
  const wanted = messages[locale].events.host.cta;

  if (existing && !OLD_CTA.includes(existing) && !force) {
    console.log(`${locale}: bändi nupp on omaniku oma ("${existing}"), ei puutu`);
    return;
  }
  if (existing === wanted) {
    console.log(`${locale}: bändi nupp juba "${wanted}"`);
    return;
  }

  await payload.updateGlobal({
    slug: "page-editor",
    locale,
    overrideAccess: true,
    data: { eventsHost: { ...(current?.eventsHost || {}), cta: wanted } }
  });
  console.log(`${locale}: bändi nupp "${existing || "(tühi)"}" -> "${wanted}"`);
}

for (const locale of ["et", "en"] as const) {
  await seedHostEvent(locale);
  await updateBandCta(locale);
}

console.log("Valmis.");
process.exit(0);
