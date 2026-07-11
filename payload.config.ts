import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Events } from "@/payload/collections/Events";
import { JournalArticles } from "@/payload/collections/JournalArticles";
import { Media } from "@/payload/collections/Media";
import { Orders } from "@/payload/collections/Orders";
import { Pages } from "@/payload/collections/Pages";
import { Products } from "@/payload/collections/Products";
import { Trainings } from "@/payload/collections/Trainings";
import { ToolCards } from "@/payload/collections/ToolCards";
import { Users } from "@/payload/collections/Users";
import { HomePage } from "@/payload/globals/HomePage";
import { PageImages } from "@/payload/globals/PageImages";
import { PageEditor } from "@/payload/globals/PageEditor";
import { SiteSettings } from "@/payload/globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const payloadSecret = process.env.PAYLOAD_SECRET;

if (!payloadSecret && process.env.NODE_ENV === "production") {
  throw new Error("PAYLOAD_SECRET must be configured in production.");
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "- RAIO admin"
    }
  },
  collections: [Users, Media, Pages, ToolCards, Products, Orders, Events, Trainings, JournalArticles],
  globals: [PageEditor, SiteSettings, HomePage, PageImages],
  editor: lexicalEditor(),
  localization: {
    locales: [
      { code: "et", label: "Eesti" },
      { code: "en", label: "English" }
    ],
    defaultLocale: "et",
    fallback: true
  },
  secret: payloadSecret || "dev-only-change-this-secret",
  db: postgresAdapter({
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL || "postgres://payload:payload@127.0.0.1:5432/payload"
    }
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts")
  }
});
