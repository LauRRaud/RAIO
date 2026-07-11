import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_editor_training_carousel_qualities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "page_editor_tools_carousel_proof_labels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "page_editor_about_trainers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "page_editor_about_closing_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  ALTER TABLE "page_editor_locales" ADD COLUMN "about_closing_contact_title" varchar;
  ALTER TABLE "page_editor_locales" ADD COLUMN "about_closing_instagram_label" varchar;
  ALTER TABLE "page_editor_training_carousel_qualities" ADD CONSTRAINT "page_editor_training_carousel_qualities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_editor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_editor_tools_carousel_proof_labels" ADD CONSTRAINT "page_editor_tools_carousel_proof_labels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_editor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_editor_about_trainers_items" ADD CONSTRAINT "page_editor_about_trainers_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor_about_trainers_items" ADD CONSTRAINT "page_editor_about_trainers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_editor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_editor_about_closing_values" ADD CONSTRAINT "page_editor_about_closing_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_editor"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "page_editor_training_carousel_qualities_order_idx" ON "page_editor_training_carousel_qualities" USING btree ("_order");
  CREATE INDEX "page_editor_training_carousel_qualities_parent_id_idx" ON "page_editor_training_carousel_qualities" USING btree ("_parent_id");
  CREATE INDEX "page_editor_training_carousel_qualities_locale_idx" ON "page_editor_training_carousel_qualities" USING btree ("_locale");
  CREATE INDEX "page_editor_tools_carousel_proof_labels_order_idx" ON "page_editor_tools_carousel_proof_labels" USING btree ("_order");
  CREATE INDEX "page_editor_tools_carousel_proof_labels_parent_id_idx" ON "page_editor_tools_carousel_proof_labels" USING btree ("_parent_id");
  CREATE INDEX "page_editor_tools_carousel_proof_labels_locale_idx" ON "page_editor_tools_carousel_proof_labels" USING btree ("_locale");
  CREATE INDEX "page_editor_about_trainers_items_order_idx" ON "page_editor_about_trainers_items" USING btree ("_order");
  CREATE INDEX "page_editor_about_trainers_items_parent_id_idx" ON "page_editor_about_trainers_items" USING btree ("_parent_id");
  CREATE INDEX "page_editor_about_trainers_items_locale_idx" ON "page_editor_about_trainers_items" USING btree ("_locale");
  CREATE INDEX "page_editor_about_trainers_items_image_idx" ON "page_editor_about_trainers_items" USING btree ("image_id");
  CREATE INDEX "page_editor_about_closing_values_order_idx" ON "page_editor_about_closing_values" USING btree ("_order");
  CREATE INDEX "page_editor_about_closing_values_parent_id_idx" ON "page_editor_about_closing_values" USING btree ("_parent_id");
  CREATE INDEX "page_editor_about_closing_values_locale_idx" ON "page_editor_about_closing_values" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "page_editor_training_carousel_qualities" CASCADE;
  DROP TABLE "page_editor_tools_carousel_proof_labels" CASCADE;
  DROP TABLE "page_editor_about_trainers_items" CASCADE;
  DROP TABLE "page_editor_about_closing_values" CASCADE;
  ALTER TABLE "page_editor_locales" DROP COLUMN "about_closing_contact_title";
  ALTER TABLE "page_editor_locales" DROP COLUMN "about_closing_instagram_label";`)
}
