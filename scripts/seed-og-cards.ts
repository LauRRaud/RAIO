// @ts-nocheck -- one-off data bridge: public/og/*.jpg -> Payload "media" + "seo" global
/*
 * Laeb scripts/generate-og-cards.mjs tehtud jagamiskaardid Payloadi ja seob
 * need SEO-globaali lehepõhiste „Jagamispilt” väljadega — täpselt sama tulemus,
 * mille annaks seitse käsitsi üleslaadimist admini vormil.
 *
 *   npm run seed:og            # täidab ainult tühjad väljad
 *   npm run seed:og -- --force # kirjutab ka juba seatud pildi üle
 *
 * Idempotentne kahel tasandil: media-doc leitakse alt-teksti järgi üles (uut ei
 * tehta) ja juba seatud shareImage jäetakse rahule.
 *
 * MÕLEMAD KEELED. shareImage on localized (migratsioon 20260727_200000), seega
 * eesti ja inglise leht saavad kumbki oma kaardi — kaardil seisab lehe nimi
 * pildi peal, mistõttu üks pilt kahe keele peale ei kõlba.
 *
 * Käivita ka SERVERIS — public/media on gitignore'is, seega prod-i andmebaas ja
 * failid on lokaalsetest eraldi (vt memory deploy-to-server). Kaardifailid ise
 * on gitis, seega `git pull` toob nad serverisse kaasa.
 *
 * NB! SERVERIS TULEB PÄRAST SEDA pm2 RESTARTIDA. Next loeb public/ sisu
 * käivitumisel sisse, seega siin loodud failid annavad /media/... pealt 404
 * kuni restardini — build'i pole vaja, ainult restart. Uued kaardid olid
 * esimesel korral täpselt sellepärast prodis katki (2026-07-28).
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

/* SEO-globaali lehevõti -> kaardifaili tüvi + lehe nimi mõlemas keeles.
   Võtmed on samad mis payload/globals/Seo.ts seoPages ja lib/seo.js
   PAGE_PATHS, failitüved samad mis generate-og-cards.mjs PAGES. */
const CARDS = [
  { key: "home", file: "og-avaleht", et: "avaleht", en: "home" },
  { key: "training", file: "og-treeningud", et: "treeningud", en: "training" },
  { key: "tools", file: "og-vahendid", et: "vahendid", en: "tools" },
  { key: "events", file: "og-sundmused", et: "sündmused", en: "events" },
  { key: "journal", file: "og-journal", et: "RA•IO+", en: "RA•IO+" },
  { key: "shop", file: "og-pood", et: "pood", en: "shop" },
  { key: "about", file: "og-meist", et: "meist", en: "about" }
];

/* Kaardi keeleversioon: fail ja alt-tekstid. Alt on otsinguvõti, seega peab
   iga keele kaart olema eristatav — muidu leiaks inglise jooks eesti doci ja
   kirjutaks talle inglise pildi peale. EESTI ALT ON MUUTUMATU: nii leiab
   skript juba prodis olevad seitse docti üles ega tee neist duplikaate. */
function variant(card: (typeof CARDS)[number], locale: "et" | "en") {
  const tag = locale === "en" ? " (EN)" : "";

  return {
    file: `${card.file}${locale === "en" ? "-en" : ""}.jpg`,
    alt: {
      et: `RA•IO jagamispilt${tag}: ${card.et}`,
      en: `RA•IO share image${tag}: ${card.en}`
    }
  };
}

/* Otsinguvõti on ALT, mitte failinimi. Payload ei kirjuta uploadi uuendamisel
   vana faili üle, vaid nimetab uue ümber (og-avaleht.jpg -> og-avaleht-1.jpg);
   failinime järgi otsides ei leia järgmine jooks oma docti enam üles ja teeb
   duplikaadi. Alt on meie enda kirjutatud, kaardi kohta unikaalne ja püsib. */
async function ensureMedia({ file, alt }) {
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
    where: { alt: { equals: alt.et } }
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
    data: { alt: alt.et },
    filePath
  });

  /* Alt on localized ja required: ilma teise keeleta jääks inglise admin tühja
     kohustusliku välja peale seisma. */
  await payload.update({
    collection: "media",
    id: created.id,
    overrideAccess: true,
    locale: "en",
    data: { alt: alt.en }
  });

  return { id: created.id, state: doc ? "asendatud" : "üles laaditud", rebind: true };
}

let bound = 0;
let touched = 0;

for (const locale of ["et", "en"] as const) {
  /* fallbackLocale: false — vaikimisi tagastaks inglise päring eesti
     väärtused ja skript arvaks, et inglise väljad on juba täidetud. */
  const current = await payload.findGlobal({
    slug: "seo",
    locale,
    depth: 0,
    fallbackLocale: false
  });

  const data: Record<string, unknown> = {};
  console.log(`\n[${locale}]`);

  for (const card of CARDS) {
    const existing = current?.[card.key] || {};

    /* Fail käiakse ALATI üle, ka siis, kui seos on juba olemas — muidu jääks
       uuendatud kujundusega kaart lokaalseks ja prod näitaks vana pilti. */
    const media = await ensureMedia(variant(card, locale));
    if (!media) continue;
    if (media.state !== "olemas") touched += 1;

    /* rebind: uus doc = uus ID, seega seos TULEB üle kirjutada ka siis, kui
       väli oli juba täidetud — muidu osutaks globaal kustutatud pildile. */
    if (existing.shareImage && !force && !media.rebind) {
      console.log(`  ${card.key}: ${variant(card, locale).file} (${media.state}), seos juba paigas`);
      continue;
    }

    data[card.key] = { ...existing, shareImage: media.id };
    console.log(`  ${card.key}: ${variant(card, locale).file} (${media.state}), seotud`);
  }

  if (Object.keys(data).length) {
    await payload.updateGlobal({ slug: "seo", locale, overrideAccess: true, data });
    bound += Object.keys(data).length;
  }
}

console.log(`\nValmis: ${bound} uut seost, ${touched} faili puudutatud.`);
process.exit(0);
