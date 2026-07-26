// @ts-nocheck -- surgical one-off: add the second trainer (Marten) to the
// localized `page-editor` global. The CMS list REPLACES messages/*.json at
// runtime (lib/payloadContent.js), so adding him to the JSON alone leaves the
// live page showing one trainer. Idempotent: skips if a card with that name
// already exists. Preserves every existing card, style and section.
//   npx tsx scripts/add-trainer-marten.ts
import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import { getPayload } from "payload";

const root = process.cwd();
const { loadEnvConfig } = nextEnv;
loadEnvConfig(root);

const { default: config } = await import("../payload.config");
const payload = await getPayload({ config });

const NAME = "Marten";

const messages = {
  et: JSON.parse(fs.readFileSync(path.join(root, "messages", "et.json"), "utf8")),
  en: JSON.parse(fs.readFileSync(path.join(root, "messages", "en.json"), "utf8"))
};

for (const locale of ["et", "en"] as const) {
  const current = await payload.findGlobal({ slug: "page-editor", locale, depth: 0 });
  const items = current.aboutTrainers?.items ?? [];
  if (items.some((item) => (item?.name ?? "").trim().toLowerCase() === NAME.toLowerCase())) {
    console.log(`${locale}: "${NAME}" on juba olemas — vahele jäetud`);
    continue;
  }
  const source = (messages[locale].about.trainers ?? []).find((t) => t.name === NAME);
  if (!source) {
    console.log(`${locale}: messages/${locale}.json ei sisalda treenerit "${NAME}" — vahele jäetud`);
    continue;
  }
  // Pilti EI panda: ilma üleslaadimiseta langeb see tagasi messages'i sama
  // indeksi pildile (/Pictures/Meist/treener2.jpg). Admini kaudu saab hiljem
  // päris faili peale laadida.
  await payload.updateGlobal({
    slug: "page-editor",
    locale,
    overrideAccess: true,
    data: {
      aboutTrainers: {
        ...current.aboutTrainers,
        items: [...items, { name: source.name, text: source.text }]
      }
    }
  });
  console.log(`${locale}: lisatud "${source.name}" (kaarte kokku ${items.length + 1})`);
}

process.exit(0);
