/* Sektsioonitaustade responsive-variandid.

   Probleem: taustad käivad tavalise <img>-na (mitte next/image, sest
   crossfade-slaidiseanss elab CSS-is), seega telefon tõmbab sama faili nagu
   töölaud. Lighthouse 2026-07-26: "larger than it needs to be (1957x1363) for
   its displayed dimensions (1379x940)".

   Lahendus EI OLE tugevam kompressioon — omanik nägi q55 juures heleda kivi
   pehmenemist. Variandid tehakse SAMA kvaliteediga (q60), ainult väiksemate
   mõõtmetega: telefoni ekraan on ~1170 pikslit lai ja rohkemat ta näidata ei
   saa, seega 1200 px fail annab seal identse pildi.

   Väljund:
   - public/RAIO taust/<kategooria>/w1200/<nimi>.webp  (ja w1600)
     Alamkaustad on lib/textureSets.js filtrile nähtamatud (see nõuab
     pildilaiendit), seega need ei ilmu slaidiseansi kirjeteks.
   - lib/textureVariants.json — kaart, mille järgi klientkomponent srcset'i
     ehitab. Kaardis puuduv pilt (nt admini kaudu üles laetud) renderdub
     lihtsalt ilma srcset'ita.

   Käivita: npm run textures:variants  */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "RAIO taust");
const MANIFEST = path.join(process.cwd(), "lib", "textureVariants.json");
const WIDTHS = [1200, 1600];
const QUALITY = 60;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

const manifest = {};
let made = 0;
let skipped = 0;

for (const folder of fs.readdirSync(ROOT)) {
  const dir = path.join(ROOT, folder);
  if (!fs.statSync(dir).isDirectory()) continue;

  for (const file of fs.readdirSync(dir).filter((f) => IMAGE_EXT.test(f))) {
    const source = path.join(dir, file);
    const buffer = fs.readFileSync(source);
    const { width: baseWidth } = await sharp(buffer).metadata();

    const variants = [];
    for (const w of WIDTHS) {
      /* Ei tekita varianti, mis on originaalist laiem või sama lai. */
      if (w >= baseWidth) continue;

      const outDir = path.join(dir, `w${w}`);
      fs.mkdirSync(outDir, { recursive: true });
      const out = path.join(outDir, file);

      /* Vahele, kui variant on juba olemas ja originaalist uuem. */
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(source).mtimeMs) {
        variants.push(w);
        skipped += 1;
        continue;
      }

      const data = await sharp(buffer)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toBuffer();
      fs.writeFileSync(out, data);
      variants.push(w);
      made += 1;
      console.log(
        `${folder}/w${w}/${file}`.padEnd(34),
        `${(buffer.length / 1024).toFixed(0)} KB → ${(data.length / 1024).toFixed(0)} KB`
      );
    }

    if (variants.length) {
      /* Võti peab kattuma sellega, mida getTextureImages tagastab (encodeURI). */
      manifest[encodeURI(`/RAIO taust/${folder}/${file}`)] = { base: baseWidth, variants };
    }
  }
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log("---");
console.log(`${made} varianti tehtud, ${skipped} juba olemas`);
console.log(`kaart: lib/textureVariants.json (${Object.keys(manifest).length} pilti)`);
