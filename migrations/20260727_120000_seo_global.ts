import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the "SEO · Google ja jagamine" global (slug `seo`): per-page title and
 * description (localized), per-page share image, robots.txt toggles and
 * sitemap include flags.
 *
 * Written by hand — `npx payload migrate:create` is broken on this
 * Windows/tsx setup (ENOENT node:crypto?tsx-namespace=). Column names follow
 * Payload's group flattening (`home` group + `title` field -> `home_title`),
 * mirroring 20260711_183641_page_editor_and_tool_cards (localized global) and
 * 20260621_211020_page_images_global (upload columns).
 *
 * Also adds one read-only guide field to the admin_guide global.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "seo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"home_share_image_id" integer,
  	"training_share_image_id" integer,
  	"tools_share_image_id" integer,
  	"events_share_image_id" integer,
  	"journal_share_image_id" integer,
  	"shop_share_image_id" integer,
  	"about_share_image_id" integer,
  	"default_share_image_id" integer,
  	"robots_allow_ai_bots" boolean DEFAULT true,
  	"robots_extra_disallow" varchar,
  	"sitemap_home" boolean DEFAULT true,
  	"sitemap_training" boolean DEFAULT true,
  	"sitemap_tools" boolean DEFAULT true,
  	"sitemap_events" boolean DEFAULT true,
  	"sitemap_journal" boolean DEFAULT true,
  	"sitemap_shop" boolean DEFAULT true,
  	"sitemap_about" boolean DEFAULT true,
  	"sitemap_products" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "seo_locales" (
  	"site_title" varchar,
  	"site_description" varchar,
  	"home_title" varchar,
  	"home_description" varchar,
  	"training_title" varchar,
  	"training_description" varchar,
  	"tools_title" varchar,
  	"tools_description" varchar,
  	"events_title" varchar,
  	"events_description" varchar,
  	"journal_title" varchar,
  	"journal_description" varchar,
  	"shop_title" varchar,
  	"shop_description" varchar,
  	"about_title" varchar,
  	"about_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "seo" ADD CONSTRAINT "seo_home_share_image_id_media_id_fk" FOREIGN KEY ("home_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_training_share_image_id_media_id_fk" FOREIGN KEY ("training_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_tools_share_image_id_media_id_fk" FOREIGN KEY ("tools_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_events_share_image_id_media_id_fk" FOREIGN KEY ("events_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_journal_share_image_id_media_id_fk" FOREIGN KEY ("journal_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_shop_share_image_id_media_id_fk" FOREIGN KEY ("shop_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_about_share_image_id_media_id_fk" FOREIGN KEY ("about_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_default_share_image_id_media_id_fk" FOREIGN KEY ("default_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo"("id") ON DELETE cascade ON UPDATE no action;

  CREATE UNIQUE INDEX IF NOT EXISTS "seo_locales_locale_parent_id_unique" ON "seo_locales" USING btree ("_locale","_parent_id");

  ALTER TABLE "admin_guide" ADD COLUMN IF NOT EXISTS "seo_basics" varchar DEFAULT 'SEO · GOOGLE JA JAGAMINE — mida Google ja Facebook sinu lehtedest näitavad.
  „Lehtede tekstid” — iga lehe pealkiri ja kirjeldus otsingutulemuses. Tühi väli = praegune tekst jääb kehtima.
  „Jagamispilt” — pilt, mis ilmub lingi jagamisel Facebookis või WhatsAppis.
  „robots.txt” ja „Sitemap” — mida otsingurobotid tohivad lugeda ja millised lehed Google''ile ette antakse.
  Muudatus jõustub kohe pärast Save. Google võtab uued tekstid kasutusele mõne päeva jooksul.';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "admin_guide" DROP COLUMN IF EXISTS "seo_basics";
   DROP TABLE IF EXISTS "seo_locales" CASCADE;
   DROP TABLE IF EXISTS "seo" CASCADE;
  `)
}
