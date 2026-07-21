// @ts-nocheck -- surgical one-off: push the About-page trainer bio from messages
// into the localized `page-editor` global (the CMS value overrides messages at
// runtime — see lib/payloadContent.js). Updates ONLY aboutTrainers[].text,
// preserving name, image, styles and every other section. Run on the server:
//   npx tsx scripts/update-trainer-bio.ts
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

for (const locale of ["et", "en"] as const) {
  const current = await payload.findGlobal({ slug: "page-editor", locale, depth: 0 });
  const source = messages[locale].about.trainers ?? [];
  const items = (current.aboutTrainers?.items ?? []).map((item, index) => ({
    ...item,
    text: source[index]?.text ?? item.text
  }));
  await payload.updateGlobal({
    slug: "page-editor",
    locale,
    overrideAccess: true,
    data: { aboutTrainers: { ...current.aboutTrainers, items } }
  });
  console.log(`${locale}: aboutTrainers[0].text -> ${(items[0]?.text ?? "").slice(0, 72)}…`);
}

process.exit(0);
