import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the "Taustaslaidid" global (texture-backdrops): a slideshow interval and
 * five hasMany media upload fields (dark/gray/light/terracotta/green).
 * hasMany uploads live in the shared <global>_rels table, keyed by "path".
 *
 * Written by hand — `npx payload migrate:create` is broken on this
 * Windows/tsx setup (ENOENT node:crypto?tsx-namespace=). DDL mirrors the
 * patterns of 20260621_211020_page_images_global (global table) and the
 * initial schema's products_rels (rels table).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "texture_backdrops" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"interval" numeric DEFAULT 20,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "texture_backdrops_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );

  ALTER TABLE "texture_backdrops_rels" ADD CONSTRAINT "texture_backdrops_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."texture_backdrops"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texture_backdrops_rels" ADD CONSTRAINT "texture_backdrops_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "texture_backdrops_rels_order_idx" ON "texture_backdrops_rels" USING btree ("order");
  CREATE INDEX "texture_backdrops_rels_parent_idx" ON "texture_backdrops_rels" USING btree ("parent_id");
  CREATE INDEX "texture_backdrops_rels_path_idx" ON "texture_backdrops_rels" USING btree ("path");
  CREATE INDEX "texture_backdrops_rels_media_id_idx" ON "texture_backdrops_rels" USING btree ("media_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "texture_backdrops_rels" CASCADE;
   DROP TABLE IF EXISTS "texture_backdrops" CASCADE;
  `)
}
