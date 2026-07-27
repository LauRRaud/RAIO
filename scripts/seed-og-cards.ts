// @ts-nocheck -- one-off data bridge: public/og/*.jpg -> Payload "media" + "seo" global
/*
 * Laeb scripts/generate-og-cards.mjs tehtud jagamiskaardid Payloadi ja seob
 * need SEO-globaali lehepõhiste „Jagamispilt” väljadega — täpselt sama tulemus,
 * mille annaks seitse käsitsi üleslaadimist admini vormil.
 *
 *   npm run seed:og            # täidab ainult tühjad väljad
 *   npm run seed:og -- --force # kirjutab ka juba seatud pildi üle
 *
 * Idempotentne kahel tasandil: media-doc leitakse failinime järgi üles (uut ei
 * tehta) ja juba seatud shareImage jäetakse rahule.
 *
 * Käivita ka SERVERIS — public/media on gitignore'is, seega prod-i andmebaas ja
 * failid on lokaalsetest eraldi (vt memory deploy-to-server). Kaardifailid ise
 * on gitis, seega `git pull` toob nad serverisse kaasa.
 *
 * NB! Ainult eestikeelsed kaardid. Seo.ts shareImage ei ole `localized: true`,
 * seega üks pilt kehtib mõlemas keeles; public/og/en/ kaardid ootavad välja
 * lokaliseerimist (vt generate-og-cards.mjs päis).
 */
import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import { getPayload } from "payload";

const root = process.cwd();
const { loadEnvConfig } = nextEnv;
loadEnvConfig(root);

const { default: config } = await import("../payload.config");
const payload = await getPayload({ config });

const force = process.argv.includes("--force");

/* SEO-globaali lehevõti -> kaardifail + alt-tekstid. Võtmed on samad mis
   payload/globals/Seo.ts seoPages ja lib/seo.js PAGE_PATHS. */
const CARDS = [
  { key: "home", file: "og-avaleht.jpg", et: "RA•IO jagamispilt: avaleht", en: "RA•IO share image: home" },
  { key: "training", file: "og-treeningud.jpg", et: "RA•IO jagamispilt: treeningud", en: "RA•IO share image: training" },
  { key: "tools", file: "og-vahendid.jpg", et: "RA•IO jagamispilt: vahendid", en: "RA•IO share image: tools" },
  { key: "events", file: "og-sundmused.jpg", et: "RA•IO jagamispilt: sündmused", en: "RA•IO share image: events" },
  { key: "journal", file: "og-journal.jpg", et: "RA•IO jagamispilt: RA•IO+", en: "RA•IO share image: RA•IO+" },
  { key: "shop", file: "og-pood.jpg", et: "RA•IO jagamispilt: pood", en: "RA•IO share image: shop" },
  { key: "about", file: "og-meist.jpg", et: "RA•IO jagamispilt: meist", en: "RA•IO share image: about" }
];

/* Payload annab uploadile unikaalse nime alles siis, kui sama nimi on hõivatud
   (og-pood-1.jpg). Otsime seepärast TÄPSE nime järgi: kui doc on olemas, on ta
   meie oma ja teist ei tehta. */
async function ensureMedia({ file, et, en }) {
  const existing = await payload.find({
    collection: "media",
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: file } }
  });

  if (existing.docs[0]) return { id: existing.docs[0].id, created: false };

  const filePath = path.join(root, "public", "og", file);
  if (!fs.existsSync(filePath)) {
    console.warn(`  puudub, jätan vahele: public/og/${file} (jooksuta enne npm run og:cards)`);
    return null;
  }

  const created = await payload.create({
    collection: "media",
    overrideAccess: true,
    locale: "et",
    data: { alt: et },
    filePath
  });

  /* Alt on localized ja required: ilma teise keeleta jääks inglise admin tühja
     kohustusliku välja peale seisma. */
  await payload.update({
    collection: "media",
    id: created.id,
    overrideAccess: true,
    locale: "en",
    data: { alt: en }
  });

  return { id: created.id, created: true };
}

/* fallbackLocale: false — vaikimisi tagastaks päring eesti väärtused ka siis,
   kui inglise väli on tühi, ja spread kirjutaks need inglise poolele sisse. */
const current = await payload.findGlobal({
  slug: "seo",
  locale: "et",
  depth: 0,
  fallbackLocale: false
});

const data: Record<string, unknown> = {};
let uploaded = 0;

for (const card of CARDS) {
  const existing = current?.[card.key] || {};

  if (existing.shareImage && !force) {
    console.log(`${card.key}: jagamispilt juba seatud, jätan vahele`);
    continue;
  }

  const media = await ensureMedia(card);
  if (!media) continue;
  if (media.created) uploaded += 1;

  data[card.key] = { ...existing, shareImage: media.id };
  console.log(`${card.key}: ${card.file}${media.created ? " (üles laaditud)" : " (juba olemas)"}`);
}

if (!Object.keys(data).length) {
  console.log("Midagi muuta ei olnud.");
  process.exit(0);
}

await payload.updateGlobal({ slug: "seo", locale: "et", overrideAccess: true, data });

console.log(`Valmis: ${Object.keys(data).length} lehte seotud, ${uploaded} uut faili.`);
process.exit(0);
