import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the "textures" upload collection (Taustatekstuurid) and points the
 * Taustaslaidid global at it instead of "media".
 *
 * Why a separate collection: textures need their own derivative sizes — two
 * landscape widths for srcset plus a PORTRAIT crop for phones. Putting those
 * imageSizes on "media" would generate the same derivatives for every product
 * photo and trainer portrait. It also gives the owner a visible library
 * ("media" is admin.hidden) so textures can be seen, swapped and added.
 *
 * The media_id column is dropped rather than kept: `SELECT count(*) FROM
 * texture_backdrops_rels` returned 0 before this migration, so no editor had
 * ever picked a texture through the old relation — there is nothing to migrate.
 *
 * Written by hand for the same reason as 20260720_180000_texture_backdrops:
 * `npx payload migrate:create` is broken on this Windows/tsx setup (ENOENT
 * node:crypto?tsx-namespace=). Column names are NOT guessed — they were read
 * straight out of Payload's own Drizzle schema objects (payload.db.tables),
 * which is why the size fields are named medium/wide/portrait: digit-bearing
 * names like "w1200" make Payload's snake-caser ambiguous (same caser that
 * produces "thumbnail_u_r_l").
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_textures_category" AS ENUM('dark', 'gray', 'light', 'terracotta', 'green');

  CREATE TABLE IF NOT EXISTS "textures" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"source_path" varchar,
  	"category" "enum_textures_category",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar,
  	"sizes_portrait_url" varchar,
  	"sizes_portrait_width" numeric,
  	"sizes_portrait_height" numeric,
  	"sizes_portrait_mime_type" varchar,
  	"sizes_portrait_filesize" numeric,
  	"sizes_portrait_filename" varchar
  );

  CREATE INDEX "textures_updated_at_idx" ON "textures" USING btree ("updated_at");
  CREATE INDEX "textures_created_at_idx" ON "textures" USING btree ("created_at");
  CREATE UNIQUE INDEX "textures_filename_idx" ON "textures" USING btree ("filename");

  ALTER TABLE "texture_backdrops_rels" DROP CONSTRAINT IF EXISTS "texture_backdrops_rels_media_fk";
  DROP INDEX IF EXISTS "texture_backdrops_rels_media_id_idx";
  ALTER TABLE "texture_backdrops_rels" DROP COLUMN IF EXISTS "media_id";
  ALTER TABLE "texture_backdrops_rels" ADD COLUMN IF NOT EXISTS "textures_id" integer;
  ALTER TABLE "texture_backdrops_rels" ADD CONSTRAINT "texture_backdrops_rels_textures_fk" FOREIGN KEY ("textures_id") REFERENCES "public"."textures"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "texture_backdrops_rels_textures_id_idx" ON "texture_backdrops_rels" USING btree ("textures_id");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "textures_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_textures_fk" FOREIGN KEY ("textures_id") REFERENCES "public"."textures"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_textures_id_idx" ON "payload_locked_documents_rels" USING btree ("textures_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_textures_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_textures_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "textures_id";

  ALTER TABLE "texture_backdrops_rels" DROP CONSTRAINT IF EXISTS "texture_backdrops_rels_textures_fk";
  DROP INDEX IF EXISTS "texture_backdrops_rels_textures_id_idx";
  ALTER TABLE "texture_backdrops_rels" DROP COLUMN IF EXISTS "textures_id";
  ALTER TABLE "texture_backdrops_rels" ADD COLUMN IF NOT EXISTS "media_id" integer;
  ALTER TABLE "texture_backdrops_rels" ADD CONSTRAINT "texture_backdrops_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "texture_backdrops_rels_media_id_idx" ON "texture_backdrops_rels" USING btree ("media_id");

  DROP TABLE IF EXISTS "textures" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_textures_category";
  `)
}
