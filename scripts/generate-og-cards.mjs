/* Jagamiskaardid (Facebook, WhatsApp, LinkedIn, Slack) — 1200×630 JPEG.
 *
 * Kaart kannab sama kujunduskeelt mis alalehe päis: tume kivitekstuur laotub
 * üle terve pinna, tekst seisab vasakul otse tekstuuril ja foto on paremal
 * RAAMIS, mitte servani laiali. Raam on siin sisuline, mitte kaunistus —
 * täisservani foto luges Facebookis pooleks lõiganuna (omanik 2026-07-27:
 * „pildid nagu lõigatud pooleks, sa raamiga ei saa panna jah?”).
 *
 * Raami mõõdud tulevad card-chrome.css-ist (--raio-frame-line 2px
 * rgba(253,248,238,0.92), --raio-frame-inset ~12px), taust
 * lib/textureSets.js `dark` komplektist — kaart ja sait ei tohi lahku minna.
 *
 * Foto ise ei kannata ka raami sees vertikaalset kärbet: lähtefotod on 4:3 ja
 * 3:2, seega raamiava suhe hoitakse alla 1,33 ja `object-fit: cover` lõikab
 * ainult külgedelt.
 *
 * Renderdame Playwrightiga, mitte sharp'iga, sest kaardil on päris Posterama
 * tekst ja logo — sharp/librsvg ei laadi projekti kohalikku fonti.
 *
 * Käivitus:  npm run og:cards
 * Väljund:   public/og/og-<leht>.jpg (et) ja public/og/en/og-<leht>.jpg (en)
 *
 * NB! Failid ise ei jõua avalikele lehtedele automaatselt — lib/seo.js loeb
 * jagamispilti admini SEO-globaalist (Payload → SEO · Google ja jagamine →
 * iga lehe „Jagamispilt”). Vaikepilt /og/og-default.jpg on ainus, mis kehtib
 * ilma admini sammuta.
 *
 * NB2! og/en/ kaardid on praegu VARUKS, mitte kasutusel: Seo.ts shareImage ei
 * ole `localized: true`, seega admini üks pilt kehtib mõlemas keeles ja EN
 * kaardi üleslaadimine kirjutaks ET oma üle. Kui kakskeelsus on vaja päriselt
 * sisse lülitada, tuleb väli lokaliseerida (Postgresis kolib veerg
 * seo → seo_locales, ehk käsitsi migratsioon).
 */

import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const outDir = path.join(publicDir, "og");

const WIDTH = 1200;
const HEIGHT = 630;

/* Raamitud foto kast. 548×506 ehk suhe 1,08 — kitsam kui ükski lähtefoto
   (1,33 ja 1,50), seega cover lõikab ainult külgedelt. */
const PHOTO_W = 548;
const PHOTO_H = 506;
const TEXT_W = WIDTH - PHOTO_W - 72 - 48 - 40; // äärised: vasak 72, parem 48, vahe 40

const TITLE_MAX = 64; // Posterama on versaalfont ja lai — päris suurus mõõdetakse brauseris

const FONT = path.join(root, "app", "(frontend)", "fonts", "Posterama-2001-W04-Regular.ttf");
const LOGO = path.join(publicDir, "Logo", "RAIO_horizontal_white_transparent.svg");
const TEXTURE = path.join(publicDir, "RAIO taust", "01-mustad-tumedad", "1.webp");

/* Iga leht + tema hero-foto. Sama foto, mida leht ise päises näitab — nii on
   jagatud link ja avanev leht sama pilt, mitte kaks eri maailma. */
const PAGES = [
  { key: "avaleht", photo: "/Pictures/Avaleht/RAIO HERO1.webp", et: "Trenn on tunne.", en: "Training is a feeling." },
  { key: "treeningud", photo: "/Pictures/Treeningud/header.webp", et: "Treeningud", en: "Training" },
  { key: "vahendid", photo: "/Pictures/Vahendid/header.webp", et: "Vahendid", en: "Tools" },
  { key: "sundmused", photo: "/Pictures/Sündmused/sundmused-header.webp", et: "Sündmused", en: "Events" },
  { key: "journal", photo: "/Pictures/Journal/header vasakule.webp", et: "RA•IO+", en: "RA•IO+" },
  { key: "pood", photo: "/Pictures/Pood/header pood.webp", et: "Pood", en: "Shop" },
  { key: "meist", photo: "/Pictures/Journal/RAIO MEIST1.webp", et: "Meist", en: "About" }
];

function card({ title, photoUrl, fontUrl, logoUrl, textureUrl }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face {
    font-family: "Posterama";
    src: url("${fontUrl}") format("truetype");
    font-weight: 400;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    display: flex;
    align-items: center;
    gap: 40px;
    padding: 0 48px 0 72px;
    background: #17130f;
    color: #fdf8ee;
    font-family: "Posterama", serif;
  }
  /* Kivitekstuur laotub üle terve pinna, tumendav kiht selle peal hoiab
     valge kirja loetavana ka tekstuuri heledatel laikudel. */
  .backdrop {
    position: fixed;
    inset: 0;
    background: url("${textureUrl}") center / cover no-repeat;
    z-index: -2;
  }
  .backdrop::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(12, 9, 6, 0.46);
  }
  .copy {
    flex: 0 0 ${TEXT_W}px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    /* Logo ja pealkiri on ÜKS rühm keset veergu. Varem seisis logo üleval ja
       pealkiri all servas ning vahele jäi tühjus (omanik 2026-07-27). */
    justify-content: center;
    gap: 44px;
  }
  .logo { width: 232px; display: block; }
  .title {
    font-size: ${TITLE_MAX}px;
    line-height: 1.24;
    letter-spacing: 0.01em;
    text-wrap: balance;
    text-shadow: 0 2px 18px rgba(10, 7, 4, 0.55);
  }
  /* Foto raamis: pilt täidab kasti, valge joon jookseb pildi SEES, nagu
     alalehe päises (card-chrome.css --raio-frame-inset / --raio-frame-line). */
  .figure {
    flex: 0 0 ${PHOTO_W}px;
    position: relative;
    width: ${PHOTO_W}px;
    height: ${PHOTO_H}px;
    box-shadow: 0 18px 34px -8px rgba(12, 8, 4, 0.5);
  }
  .figure img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .figure::after {
    content: "";
    position: absolute;
    inset: 12px;
    border: 2px solid rgba(253, 248, 238, 0.92);
  }
</style></head>
<body>
  <div class="backdrop"></div>
  <div class="copy">
    <img class="logo" src="${logoUrl}" alt="">
    <div class="title">${title}</div>
  </div>
  <div class="figure"><img src="${photoUrl}" alt=""></div>
</body></html>`;
}

/* setContent() jätab lehe about:blank päritolule ja Chromium ei laadi sealt
   ühtegi file:// alamressurssi — foto, logo ja font jäid vaikides tulemata.
   Seepärast kirjutame kaardi ajutise failina public/ juurde ja avame ta
   päris file:// aadressilt; --allow-file-access-from-files lubab fondi. */
const tmpHtml = path.join(publicDir, "__og-card.html");
const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });

const fontUrl = pathToFileURL(FONT).href;
const logoUrl = pathToFileURL(LOGO).href;
const textureUrl = pathToFileURL(TEXTURE).href;

await fs.mkdir(path.join(outDir, "en"), { recursive: true });

for (const entry of PAGES) {
  const photoUrl = pathToFileURL(path.join(publicDir, entry.photo)).href;

  for (const locale of ["et", "en"]) {
    await fs.writeFile(
      tmpHtml,
      card({ title: entry[locale], photoUrl, fontUrl, logoUrl, textureUrl }),
      "utf8"
    );
    await page.goto(pathToFileURL(tmpHtml).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    /* Pealkiri kahaneb, kuni mahub tekstiveergu ja kolme ritta. Ilma selleta
       jäi „SÜNDMUSED” poolikuks — Posterama on versaalfont ja sõna tegelik
       laius selgub alles renderdusest. */
    await page.evaluate((max) => {
      const el = document.querySelector(".title");
      for (let size = max; size >= 28; size -= 2) {
        el.style.fontSize = `${size}px`;
        if (el.scrollWidth <= el.clientWidth && el.getBoundingClientRect().height <= size * 3.9) break;
      }
    }, TITLE_MAX);

    const file =
      locale === "et"
        ? path.join(outDir, `og-${entry.key}.jpg`)
        : path.join(outDir, "en", `og-${entry.key}.jpg`);

    await page.screenshot({ path: file, type: "jpeg", quality: 88 });
    console.log(`${path.relative(root, file)}`);
  }
}

/* Vaikepilt = avalehe kaart. See on ainus fail, mis kehtib ka siis, kui admini
   SEO-väljad on tühjad, seega ta ei tohi olla katkine kropp. */
await fs.copyFile(path.join(outDir, "og-avaleht.jpg"), path.join(outDir, "og-default.jpg"));
console.log("public/og/og-default.jpg (koopia avalehe kaardist)");

await fs.rm(tmpHtml, { force: true });
await browser.close();
