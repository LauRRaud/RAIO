// CSS-i duplikaadivalvur: sama (media × selektor × omadus) defineeritud
// MITMES failis → viga. Hoiab ära "olen viimane import, seega võidan"
// ülekirjutuskihi taastekke (vt CSS-AUDIT-HANDOFF.md).
//
// Kasutus: node scripts/css-duplicate-guard.mjs   (npm run audit:css)
// Väljund: loend + exit 1, kui failideüleseid duplikaate leidub.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ENTRY = resolve(ROOT, "app/(frontend)/globals.css");

/* Teadlikud erandid: "media|selektor|omadus" stringid (SEP-iga liidetud),
   mille failideülene topeltdefineerimine on kavatsuslik. Hoia tühi, kui
   vähegi saab. */
const ALLOWLIST = new Set([]);

const SEP = "|::|"; // media/selektor sisaldavad tühikuid ja komasid

const importRe = /^@import\s+"(\.[^"]+)";\s*$/;

function inline(file) {
  const raw = readFileSync(file, "utf8");
  // sentinel, MITTE kommentaar — peab üle elama kommentaaride eemaldamise
  let out = "@__FILE__" + file + "\n";
  for (const line of raw.split("\n")) {
    const m = line.match(importRe);
    out += m ? inline(resolve(dirname(file), m[1])) : line + "\n";
  }
  return out;
}

// Kommentaarid maha ENNE parsimist ja üle reapiiride — kommentaaris olev
// sulg nihutaks muidu sügavusloendust ja @media konteksti (valepositiivid).
const css = inline(ENTRY).replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
const lines = css.split("\n");

let file = "?";
let media = "";
let depth = 0;
let selector = null;
let buf = [];
const decls = [];
const short = (f) => f.replace(/\\/g, "/").replace(/^.*app\//, "app/");

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  const fm = line.match(/^@__FILE__(.+)$/);
  if (fm) { file = short(fm[1].trim()); continue; }

  for (let j = 0; j < line.length; j++) {
    const ch = line[j];
    if (ch === "{") {
      const head = (buf.join(" ") + " " + line.slice(0, j)).trim();
      buf = [];
      if (depth === 0 && (head.startsWith("@media") || head.startsWith("@supports"))) {
        media = head.replace(/\s+/g, " ");
      } else {
        selector = head;
      }
      depth++;
      line = line.slice(j + 1); j = -1;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) media = "";
      if (depth <= 1) selector = null;
      line = line.slice(j + 1); j = -1;
    } else if (ch === ";") {
      const stmt = (buf.join(" ") + " " + line.slice(0, j)).trim();
      buf = [];
      const m = stmt.match(/^([-a-zA-Z][-\w]*)\s*:/);
      if (m && selector && depth >= 1 && !selector.startsWith("@keyframes")) {
        decls.push({ file, media, selector, prop: m[1] });
      }
      line = line.slice(j + 1); j = -1;
    }
  }
  if (line.trim()) buf.push(line.trim());
}

const norm = (s) => s.split(",").map((x) => x.trim().replace(/\s+/g, " ")).sort().join(", ");

const byKey = new Map();
for (const d of decls) {
  const key = [d.media, norm(d.selector), d.prop].join(SEP);
  if (!byKey.has(key)) byKey.set(key, []);
  byKey.get(key).push(d);
}

const offenders = [];
for (const [key, arr] of byKey) {
  const files = [...new Set(arr.map((d) => d.file))];
  if (files.length < 2) continue;
  if (ALLOWLIST.has(key)) continue;
  const [media_, sel, prop] = key.split(SEP);
  offenders.push({ media: media_, sel, prop, files });
}

if (!offenders.length) {
  console.log("audit:css OK — " + decls.length + " deklaratsiooni, failideüleseid duplikaate pole.");
  process.exit(0);
}

console.error("audit:css FAIL — " + offenders.length + " failideülest (media × selektor × omadus) duplikaati:\n");
for (const o of offenders.sort((a, b) => a.sel.localeCompare(b.sel))) {
  console.error("  " + o.sel + " { " + o.prop + " }" + (o.media ? "  [" + o.media + "]" : ""));
  for (const f of o.files) console.error("      " + f);
}
console.error(
  "\nReegel: iga omadus defineeritakse ÜKS kord. Kui väärtus on vale, muuda" +
  "\nalgset reeglit — ära lisa hilisemat ülekirjutust teise faili."
);
process.exit(1);
