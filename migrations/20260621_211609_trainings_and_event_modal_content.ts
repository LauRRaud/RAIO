import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "trainings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"sort_order" numeric DEFAULT 100,
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "trainings_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"duration" varchar,
  	"level" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "events" ADD COLUMN "image_position" varchar DEFAULT 'center center';
  ALTER TABLE "events_locales" ADD COLUMN "content" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "trainings_id" integer;
  ALTER TABLE "trainings" ADD CONSTRAINT "trainings_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trainings_locales" ADD CONSTRAINT "trainings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "trainings_image_idx" ON "trainings" USING btree ("image_id");
  CREATE INDEX "trainings_updated_at_idx" ON "trainings" USING btree ("updated_at");
  CREATE INDEX "trainings_created_at_idx" ON "trainings" USING btree ("created_at");
  CREATE UNIQUE INDEX "trainings_locales_locale_parent_id_unique" ON "trainings_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_trainings_id_idx" ON "payload_locked_documents_rels" USING btree ("trainings_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "trainings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "trainings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "trainings" CASCADE;
  DROP TABLE "trainings_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_trainings_fk";
  
  DROP INDEX "payload_locked_documents_rels_trainings_id_idx";
  ALTER TABLE "events" DROP COLUMN "image_position";
  ALTER TABLE "events_locales" DROP COLUMN "content";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "trainings_id";`)
}
