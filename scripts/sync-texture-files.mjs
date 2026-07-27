/* Kirjutab Payloadi serveeritavad tekstuurifailid (public/media/taustad) uuesti
   kaustafailide (public/"RAIO taust") pealt.

   MIKS SEE OLEMAS ON. Kaust on gitis, public/media on gitignore'is — seega kui
   kaustafotod ümber kodeeritakse (nt q60 -> q82, 2026-07-27), jõuab uus fail
   `git pull`-iga serverisse, aga see, MIDA leht tegelikult serveerib, jääb
   vanaks. `npm run textures:import` ei aita: ta leiab pildi `sourcePath` järgi
   üles ja EI laadi uuesti üles (idempotentsus), `--force` puudutab ainult
   komplektide järjekorda.

   Skript EI puuduta andmebaasi. Ta kopeerib olemasolevate DB-kirjete NIMEDE
   peale ja kontrollib enne iga kopeerimist, et mõõt klapiks salvestatud
   laiuse/kõrgusega — muidu valetaks srcset'i descriptor brauserile. Mõõdu
   lahknevus katkestab töö, mitte ei kirjuta vaikselt katki.

   AINULT UUEMAD. Vaikimisi kopeeritakse fail ainult siis, kui kaustafail on
   serveeritavast UUEM. Ilma selleta puudutaks skript ka komplekte, mida keegi ei
   palunud muuta: nende kaustafail ja Payloadi oma on sama mõõduga, aga eri
   baitidega (Payload kodeeris impordil uuesti üle), ja "kirjuta alati üle" tegi
   neist vaikselt ühe generatsiooni võrra kehvema koopia. `--all` võtab piirangu
   maha, kui tõesti on vaja kõik ühtlustada.

   Eeldab, et kaustavariandid on olemas (npm run textures:variants):
     <kaust>/<n>.webp        -> doc.filename
     <kaust>/w1200/<n>.webp  -> doc.sizes.medium.filename
     <kaust>/w1600/<n>.webp  -> doc.sizes.wide.filename
     <kaust>/p/<n>.webp      -> doc.sizes.portrait.filename

   Käivita: npm run textures:sync   (ka serveris, pärast git pull'i)  */
import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import sharp from "sharp";
import { getPayload } from "payload";

const root = process.cwd();
const { loadEnvConfig } = nextEnv;
loadEnvConfig(root);

const { default: config } = await import("../payload.config.ts");
const payload = await getPayload({ config });

/* Peab kattuma payload/collections/Textures.ts staticDir'iga ja
   lib/payloadContent.js TEXTURE_PUBLIC_DIR'iga. */
const MEDIA_DIR = path.join(root, "public", "media", "taustad");
const FOLDER_ROOT = path.join(root, "public", "RAIO taust");

const { docs } = await payload.find({
  collection: "textures",
  limit: 500,
  depth: 0,
  overrideAccess: true
});

const all = process.argv.includes("--all");

let copied = 0;
let same = 0;
let older = 0;
let missing = 0;

for (const doc of docs) {
  /* sourcePath on kujul "/RAIO taust/06-rohelised/1.webp". Admin'is käsitsi
     lisatud pildil see puudub — sellel ei ole kaustavastet, jäta rahule. */
  if (!doc.sourcePath) continue;

  const rel = doc.sourcePath.replace(/^\/RAIO taust\//, "");
  const folder = path.dirname(rel);
  const file = path.basename(rel);

  const jobs = [
    [path.join(FOLDER_ROOT, folder, file), doc.filename, doc.width, doc.height],
    [
      path.join(FOLDER_ROOT, folder, "w1200", file),
      doc.sizes?.medium?.filename,
      doc.sizes?.medium?.width,
      doc.sizes?.medium?.height
    ],
    [
      path.join(FOLDER_ROOT, folder, "w1600", file),
      doc.sizes?.wide?.filename,
      doc.sizes?.wide?.width,
      doc.sizes?.wide?.height
    ],
    [
      path.join(FOLDER_ROOT, folder, "p", file),
      doc.sizes?.portrait?.filename,
      doc.sizes?.portrait?.width,
      doc.sizes?.portrait?.height
    ]
  ];

  for (const [src, name, width, height] of jobs) {
    if (!name) continue;
    const dest = path.join(MEDIA_DIR, name);

    if (!fs.existsSync(src)) {
      console.warn(`  lähtefail puudub, vahele: ${path.relative(root, src)}`);
      missing += 1;
      continue;
    }

    /* Vanem kaustafail jäetakse rahule — vt "AINULT UUEMAD" ülal. */
    if (!all && fs.existsSync(dest) && fs.statSync(src).mtimeMs <= fs.statSync(dest).mtimeMs) {
      older += 1;
      continue;
    }

    /* Puhvri kaudu, MITTE tee kaudu: sharp hoiab teefaili avatuna ja Windows ei
       luba samale failile hiljem kirjutada. */
    const buf = fs.readFileSync(src);
    const meta = await sharp(buf).metadata();
    if (meta.width !== Number(width) || meta.height !== Number(height)) {
      throw new Error(
        `${name}: kaustafail on ${meta.width}x${meta.height}, DB ootab ${width}x${height}. ` +
          `Kopeerimine valetaks srcset'is — jooksuta enne npm run textures:variants.`
      );
    }

    if (fs.existsSync(dest) && fs.readFileSync(dest).equals(buf)) {
      same += 1;
      continue;
    }

    fs.mkdirSync(MEDIA_DIR, { recursive: true });
    fs.writeFileSync(dest, buf);
    console.log(`  ${name.padEnd(24)} ${meta.width}x${meta.height}  ${(buf.length / 1024).toFixed(0)} KB`);
    copied += 1;
  }
}

console.log("---");
console.log(
  `${copied} faili uuendatud, ${same} juba sama, ${older} vanem kaustafail (vahele)` +
    `${missing ? `, ${missing} lähtefaili puudu` : ""}.`
);

process.exit(0);
