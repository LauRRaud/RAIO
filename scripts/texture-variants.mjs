/* Sektsioonitaustade responsive-variandid.

   Probleem: taustad käivad tavalise <img>-na (mitte next/image, sest
   crossfade-slaidiseanss elab CSS-is), seega telefon tõmbab sama faili nagu
   töölaud. Lighthouse 2026-07-26: "larger than it needs to be (1957x1363) for
   its displayed dimensions (1379x940)".

   Lahendus EI OLE tugevam kompressioon — omanik nägi q55 juures heleda kivi
   pehmenemist. Variandid tehakse SAMA kvaliteediga, ainult väiksemate
   mõõtmetega.

   PORTREEVARIANDID (2026-07-26). Ülal olnud arutlus "telefoni ekraan on ~1170
   px lai, seega 1200 px fail annab identse pildi" kehtib ainult siis, kui pilt
   kuvatakse vaateava laiuselt. Taust on aga `object-fit: cover` PÜSTISES
   bändis (mobiilis ~390x700), kuhu maastikupilt mahub KÕRGUSE järgi: 1200x800
   fail venitatakse 1050 px laiaks ja 63% sellest kärbitakse servadest välja.
   Nähtavasse 390 px aknasse jõuab siis ainult 446 lähtepikslit, kuigi ekraan
   nõuab 1170 → 2.6x ülesskaleerimine ja mudane taust (omanik 2026-07-26:
   "mobiilis on tausta kvaliteet väga halb"). Mõõdetud, mitte oletatud.

   Püstine kärbe lahendab mõlemad otsad korraga: 1200x2000 fail annab samasse
   aknasse ~1040 lähtepikslit (1.1x, terav) JA on väiksem kui maastikuoriginaal,
   sest ükski piksel ei lähe kärpes raisku.

   Lähtefail: portree tahab kõrgust, mida avalikus 2000 px failis ei ole (2000
   x1334 → püstine kärbe ainult 800x1334). Seetõttu loeb portreesamm lähte
   keskkonnamuutujast TEXTURE_HIRES, kui see on antud — kaustast, kus on
   ORIGINAALID (2800 px, enne commit bb4269c kahandamist; kätte saab
   `git show bb4269c^:"public/RAIO taust/<kat>/<fail>" > <kaust>/<kat>/<fail>`).
   Ilma selleta kärbitakse avalikust failist ja tulemus on kehvem, aga ikka
   parem kui maastikuvariant. `withoutEnlargement` hoiab, et lähtest suuremat
   kunagi ei sünni.

   Maastikuvariandid (w1200/w1600) käivad ALATI avaliku faili pealt — need on
   töölaual juba paigas ja neid ei taasgenereerita ilmaasjata.

   Väljund:
   - public/RAIO taust/<kategooria>/w1200/<nimi>.webp  (ja w1600) — maastik
   - public/RAIO taust/<kategooria>/p/<nimi>.webp — püstine, mobiilile
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
/* 3:5 on mobiilibändi kuvasuhtele (390x700 ≈ 0.56) lähim ümar suhe, nii et
   kärpes ei lähe midagi olulist kaotsi. withoutEnlargement hoiab, et lähtest
   suuremat ei sünni (2800 px originaalidest tuleb alati täismõõt).

   MIKS 960, mitte 1200. 390 px bänd DPR 3 peal nõuab 1170 seadmepikslit;
   portreefail annab neid 0.93 x oma laiusest, seega täiesti terav oleks 1260.
   Aga webp-i baidikõver murdub 1080 ja 1200 vahel järsult üles (233→307 KB,
   427→630 KB ühe faili kohta) ja tekstuuri peal istub veel 45% tint. Mõõdetud
   kogumaht 16 faili peale: praegune maastik 1.60 MB, p840 2.19, p960 2.72,
   p1080 3.27, p1200 4.55. 960 annab 1.31x ülesskaleerimise (praegu 2.63x ehk
   poole vähem hägu) ja hoiab mobiili mahu umbes tänase TÖÖLAUA eelarves
   (w1600 = 2.45 MB). Kui omanik tahab maksimaalset teravust, tõsta 1080-le. */
const PORTRAIT = { width: 960, height: 1600 };
const HIRES = process.env.TEXTURE_HIRES || "";
/* q60 -> q82 (omanik 2026-07-27). Mõõdetud: q60 sõi lähtefotolt 24–67%
   kõrgsagedusest ja desktopil (1900 CSS px @ DPR 1.25) tõi q82 tagasi +10…+51%.
   Suurem MÕÕT ei aidanud — 2560 ja 2800 px andsid ekraanil alla 5% vahet ja
   kahekordse faili, sest lähtefotodel EI OLE detaili nii kõrgel. Kadu istub
   kodeerimises, mitte skaleerimises. Peab ühtima Textures.ts formatOptions'iga. */
const QUALITY = 82;
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

    /* Püstine kärbe mobiilile. Lähe: hi-res originaal, kui TEXTURE_HIRES on
       antud ja fail seal olemas; muidu avalik fail. */
    const hires = HIRES ? path.join(HIRES, folder, file) : "";
    const portraitSource = hires && fs.existsSync(hires) ? hires : source;
    const portraitDir = path.join(dir, "p");
    fs.mkdirSync(portraitDir, { recursive: true });
    const portraitOut = path.join(portraitDir, file);

    let portraitWidth;
    if (
      fs.existsSync(portraitOut) &&
      fs.statSync(portraitOut).mtimeMs >= fs.statSync(portraitSource).mtimeMs
    ) {
      portraitWidth = (await sharp(portraitOut).metadata()).width;
      skipped += 1;
    } else {
      const data = await sharp(fs.readFileSync(portraitSource))
        .resize({ ...PORTRAIT, fit: "cover", position: "centre", withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toBuffer();
      fs.writeFileSync(portraitOut, data);
      portraitWidth = (await sharp(data).metadata()).width;
      made += 1;
      console.log(
        `${folder}/p/${file}`.padEnd(34),
        `portree ${portraitWidth}px, ${(data.length / 1024).toFixed(0)} KB`,
        portraitSource === source ? "(avalikust failist)" : "(originaalist)"
      );
    }

    if (variants.length || portraitWidth) {
      /* Võti peab kattuma sellega, mida getTextureImages tagastab (encodeURI). */
      manifest[encodeURI(`/RAIO taust/${folder}/${file}`)] = {
        base: baseWidth,
        variants,
        portrait: portraitWidth
      };
    }
  }
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log("---");
console.log(`${made} varianti tehtud, ${skipped} juba olemas`);
console.log(`kaart: lib/textureVariants.json (${Object.keys(manifest).length} pilti)`);
