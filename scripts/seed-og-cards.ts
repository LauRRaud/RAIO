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

/* Otsinguvõti on ALT, mitte failinimi. Payload ei kirjuta uploadi uuendamisel
   vana faili üle, vaid nimetab uue ümber (og-avaleht.jpg -> og-avaleht-1.jpg);
   failinime järgi otsides ei leia järgmine jooks oma docti enam üles ja teeb
   duplikaadi. Alt on meie enda kirjutatud, kaardi kohta unikaalne ja püsib. */
async function ensureMedia({ file, et, en }) {
  const filePath = path.join(root, "public", "og", file);
  if (!fs.existsSync(filePath)) {
    console.warn(`  puudub, jätan vahele: public/og/${file} (jooksuta enne npm run og:cards)`);
    return null;
  }

  const existing = await payload.find({
    collection: "media",
    limit: 1,
    locale: "et",
    overrideAccess: true,
    where: { alt: { equals: et } }
  });

  const doc = existing.docs[0];

  if (doc) {
    /* Kaardi kujundus muutub aeg-ajalt ja failinimi jääb samaks. Ainult
       olemasolu kontrollimisest jääks prodi vana pilt igaveseks — doci
       leidmine ei too uusi baite kaasa. Võrdleme suurust ja vahetame faili,
       kui kaustaversioon on teine. */
    const size = fs.statSync(filePath).size;
    if (doc.filesize === size) return { id: doc.id, state: "olemas", rebind: false };

    /* ASENDAME DOCI, mitte ei uuenda faili. payload.update({ filePath }) lisab
       nimele -1 ka siis, kui vana fail on kettalt kustutatud: nime vabadust
       kontrollitakse andmebaasist ja doc leiab konflikti iseendaga. Nii
       kasvaks iga kujundusmuudatusega og-meist-1.jpg, -2, -3 ja vanad jääks
       kausta vedelema. Kustutamine vabastab nime päriselt; docti viitab ainult
       SEO-globaal, mille me kohe uuesti seome. */
    await payload.delete({ collection: "media", id: doc.id, overrideAccess: true });
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

  return { id: created.id, state: doc ? "asendatud" : "üles laaditud", rebind: true };
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
let touched = 0;

for (const card of CARDS) {
  const existing = current?.[card.key] || {};

  /* Fail käiakse ALATI üle, ka siis, kui seos on juba olemas — muidu jääks
     uuendatud kujundusega kaart lokaalseks ja prod näitaks vana pilti. */
  const media = await ensureMedia(card);
  if (!media) continue;
  if (media.state !== "olemas") touched += 1;

  /* rebind: uus doc = uus ID, seega seos TULEB üle kirjutada ka siis, kui
     väli oli juba täidetud — muidu osutaks globaal kustutatud pildile. */
  if (existing.shareImage && !force && !media.rebind) {
    console.log(`${card.key}: ${card.file} (${media.state}), seos juba paigas`);
    continue;
  }

  data[card.key] = { ...existing, shareImage: media.id };
  console.log(`${card.key}: ${card.file} (${media.state}), seotud`);
}

if (Object.keys(data).length) {
  await payload.updateGlobal({ slug: "seo", locale: "et", overrideAccess: true, data });
}

console.log(`Valmis: ${Object.keys(data).length} uut seost, ${touched} faili puudutatud.`);
process.exit(0);
