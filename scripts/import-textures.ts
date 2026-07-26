// @ts-nocheck -- one-off bridge from the public/"RAIO taust" folder into Payload
/*
 * Impordib sektsioonide taustapildid kaustast public/"RAIO taust" Payloadi
 * kollektsiooni "textures" ja seob need Taustaslaidid globali komplektidega.
 * Pärast seda on admin ALLIKAS: omanik näeb, milline tekstuur kus on, saab neid
 * komplektide vahel vahetada, järjekorda lohistada ja uusi lisada.
 *
 *   npm run textures:import            # lisab puuduvad, ei puutu täidetud komplekte
 *   npm run textures:import -- --force # kirjutab komplektide järjekorra üle
 *
 * Idempotentne: juba imporditud pilt leitakse sourcePath järgi üles ja uut docit
 * ei tehta. Käivita ka serveris — public/media on gitignore'is, seega prod-i
 * andmebaas ja failid on eraldi (vt memory deploy-to-server).
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

/* Sama kaardistus mis lib/textureSets.js SET_FOLDERS — beige puudub teadlikult,
   sest päis/jalus jagab heledate komplekti (04-beezid kausta omanik kustutas). */
const SET_FOLDERS = {
  dark: { folder: "01-mustad-tumedad", label: "Must" },
  gray: { folder: "02-hallid", label: "Hall" },
  light: { folder: "03-heledad", label: "Hele" },
  terracotta: { folder: "05-terrakota", label: "Terrakota" },
  green: { folder: "06-rohelised", label: "Roheline" }
};

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

/* Ainult kausta juurfailid: alamkaustad w1200/w1600/p on juba genereeritud
   variandid (scripts/texture-variants.mjs) ja Payload teeb uploadist enda omad —
   nende importimine annaks sama pildi mitu korda. */
function baseImages(folder) {
  const dir = path.join(root, "public", "RAIO taust", folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && IMAGE_EXT.test(entry.name))
    .map((entry) => entry.name)
    /* Numbriteadlik sort: failid on 1.webp, 2.webp … — lihtne .sort() paneks
       10.webp enne 2.webp ja slaidijärjekord läheks segi. */
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function ensureTexture({ folder, file, category, label, index }) {
  const sourcePath = `/RAIO taust/${folder}/${file}`;

  const existing = await payload.find({
    collection: "textures",
    limit: 1,
    overrideAccess: true,
    where: { sourcePath: { equals: sourcePath } }
  });

  if (existing.docs[0]) return { id: existing.docs[0].id, created: false };

  const filePath = path.join(root, "public", "RAIO taust", folder, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`  puudub, jätan vahele: ${sourcePath}`);
    return null;
  }

  const created = await payload.create({
    collection: "textures",
    overrideAccess: true,
    data: {
      alt: `${label} ${index + 1}`,
      category,
      sourcePath
    },
    filePath
  });

  return { id: created.id, created: true };
}

const current = await payload.findGlobal({ slug: "texture-backdrops", overrideAccess: true });
const update = {};
let added = 0;
let reused = 0;
const skipped = [];

for (const [category, { folder, label }] of Object.entries(SET_FOLDERS)) {
  const files = baseImages(folder);
  if (!files.length) {
    console.warn(`${category}: kaustas ${folder} ei ole pilte`);
    continue;
  }

  const ids = [];
  for (const [index, file] of files.entries()) {
    const result = await ensureTexture({ folder, file, category, label, index });
    if (!result) continue;
    ids.push(result.id);
    if (result.created) added += 1;
    else reused += 1;
  }

  /* Täidetud komplekti EI kirjutata üle ilma --force'ita: omanik võib olla
     järjekorra juba käsitsi ümber lohistanud või mõne pildi välja võtnud, ja
     import ei tohi seda tööd tühistada. */
  const alreadySet = Array.isArray(current?.[category]) && current[category].length > 0;
  if (alreadySet && !force) {
    skipped.push(category);
    continue;
  }

  update[category] = ids;
}

if (Object.keys(update).length) {
  await payload.updateGlobal({
    slug: "texture-backdrops",
    overrideAccess: true,
    data: update
  });
}

console.log(`Tekstuurid: ${added} uut, ${reused} juba olemas.`);
console.log(
  Object.keys(update).length
    ? `Komplektid seatud: ${Object.entries(update).map(([key, ids]) => `${key}=${ids.length}`).join(", ")}`
    : "Ükski komplekt ei vajanud seadmist."
);
if (skipped.length) {
  console.log(`Puutumata (juba täidetud, kasuta --force): ${skipped.join(", ")}`);
}

process.exit(0);
