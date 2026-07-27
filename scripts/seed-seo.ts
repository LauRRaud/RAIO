// @ts-nocheck -- one-off data bridge: messages/*.json -> Payload "seo" global
//
// Täidab admini SEO-väljad praeguste avalike tekstidega, et omanik näeks
// vormil seda, mis päriselt Google'is on — mitte tühja lahtrit. Skript on
// idempotentne: juba täidetud välja üle ei kirjuta (--force teeb seda).
//
// Kasutus:  npm run seed:seo        (lokaalselt või serveris)
//           npm run seed:seo -- --force
import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import { getPayload } from "payload";

const root = process.cwd();
const { loadEnvConfig } = nextEnv;
loadEnvConfig(root);

const { default: config } = await import("../payload.config");
const payload = await getPayload({ config });

const messages = {
  et: JSON.parse(fs.readFileSync(path.join(root, "messages", "et.json"), "utf8")),
  en: JSON.parse(fs.readFileSync(path.join(root, "messages", "en.json"), "utf8"))
};

const force = process.argv.includes("--force");

/* Admini võti -> messages'i võti. Ostukorv ja makse on noindex, neil ei ole
   admini vormil kohta. */
const PAGES = ["home", "training", "tools", "events", "journal", "shop", "about"];

function pageMetadata(locale: string, key: string) {
  return messages[locale][key]?.metadata || {};
}

async function seedLocale(locale: "et" | "en") {
  /* fallbackLocale: false on siin kandev — vaikimisi tagastaks inglise päring
     eesti väärtused (config: localization.fallback) ja skript arvaks, et
     inglise väljad on juba täidetud. */
  const current = await payload.findGlobal({ slug: "seo", locale, depth: 0, fallbackLocale: false });
  const data: Record<string, unknown> = {};

  const site = current?.site || {};
  if (force || !site.title || !site.description) {
    data.site = {
      title: site.title || messages[locale].metadata.title,
      description: site.description || messages[locale].metadata.description
    };
  }

  for (const key of PAGES) {
    const md = pageMetadata(locale, key);
    const existing = current?.[key] || {};
    if (!force && existing.title && existing.description) continue;

    data[key] = {
      ...existing,
      title: force ? md.title : existing.title || md.title,
      description: force ? md.description : existing.description || md.description
    };
  }

  if (!Object.keys(data).length) {
    console.log(`${locale}: juba täidetud, jätan vahele`);
    return;
  }

  await payload.updateGlobal({ slug: "seo", locale, overrideAccess: true, data });
  console.log(`${locale}: täidetud (${Object.keys(data).join(", ")})`);
}

await seedLocale("et");
await seedLocale("en");

console.log("SEO seemnestus valmis.");
process.exit(0);
