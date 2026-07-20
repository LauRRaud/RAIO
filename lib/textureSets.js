import fs from "node:fs";
import path from "node:path";

/* Sektsioonide taustaslaidide pildid: public/"RAIO taust"/<kategooria>
   kaustad, värvi järgi rühmitatud. Kausta sisu loetakse iga kord (omanik
   2026-07-20: "ma ise neid kustutan, jätan igasse paar alles") — pilte võib
   kustutada/lisada ilma koodi muutmata. Ainult serveris (fs)! */
const SET_FOLDERS = {
  dark: "01-mustad-tumedad",
  gray: "02-hallid",
  light: "03-heledad",
  /* Omanik kustutas 04-beezid kausta (2026-07-20) — päis/jalus käivad nüüd
     heledate kausta pealt, beeži toonikiht jääb. */
  beige: "03-heledad",
  terracotta: "05-terrakota",
  green: "06-rohelised",
};

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

export function getTextureImages(set) {
  const folder = SET_FOLDERS[set];
  if (!folder) return [];
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "public", "RAIO taust", folder))
      .filter((file) => IMAGE_EXT.test(file))
      /* Numbriteadlik sort: failid on nimetatud 1.jpg, 2.jpg … — lihtne .sort()
         paneks 10.jpg enne 2.jpg. */
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => encodeURI(`/RAIO taust/${folder}/${file}`));
  } catch {
    return [];
  }
}
