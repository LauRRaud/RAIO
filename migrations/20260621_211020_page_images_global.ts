import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_images" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"home_hero_image_id" integer,
  	"home_philosophy_image_id" integer,
  	"home_training_card_image_id" integer,
  	"home_tools_card_image_id" integer,
  	"home_events_card_image_id" integer,
  	"home_about_card_image_id" integer,
  	"home_journal_card_image_id" integer,
  	"training_hero_image_id" integer,
  	"training_functional_image_id" integer,
  	"training_nature_image_id" integer,
  	"training_staying_image_id" integer,
  	"training_private_image_id" integer,
  	"training_lasting_image_id" integer,
  	"tools_hero_image_id" integer,
  	"tools_stick_image_id" integer,
  	"tools_kettlebell_image_id" integer,
  	"tools_dumbbell_image_id" integer,
  	"tools_kids_image_id" integer,
  	"tools_stone_wood_image_id" integer,
  	"tools_material_image_id" integer,
  	"tools_care_image_id" integer,
  	"tools_custom_image_id" integer,
  	"events_hero_image_id" integer,
  	"events_training_image_id" integer,
  	"events_workshop_image_id" integer,
  	"events_retreat_image_id" integer,
  	"events_ritual_image_id" integer,
  	"events_host_image_id" integer,
  	"shop_hero_image_id" integer,
  	"about_hero_image_id" integer,
  	"about_story_image_id" integer,
  	"about_trainer_image_id" integer,
  	"journal_hero_image_id" integer,
  	"journal_signup_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_home_hero_image_id_media_id_fk" FOREIGN KEY ("home_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_home_philosophy_image_id_media_id_fk" FOREIGN KEY ("home_philosophy_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_home_training_card_image_id_media_id_fk" FOREIGN KEY ("home_training_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_home_tools_card_image_id_media_id_fk" FOREIGN KEY ("home_tools_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_home_events_card_image_id_media_id_fk" FOREIGN KEY ("home_events_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_home_about_card_image_id_media_id_fk" FOREIGN KEY ("home_about_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_home_journal_card_image_id_media_id_fk" FOREIGN KEY ("home_journal_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_training_hero_image_id_media_id_fk" FOREIGN KEY ("training_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_training_functional_image_id_media_id_fk" FOREIGN KEY ("training_functional_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_training_nature_image_id_media_id_fk" FOREIGN KEY ("training_nature_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_training_staying_image_id_media_id_fk" FOREIGN KEY ("training_staying_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_training_private_image_id_media_id_fk" FOREIGN KEY ("training_private_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_training_lasting_image_id_media_id_fk" FOREIGN KEY ("training_lasting_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_tools_hero_image_id_media_id_fk" FOREIGN KEY ("tools_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_tools_stick_image_id_media_id_fk" FOREIGN KEY ("tools_stick_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_tools_kettlebell_image_id_media_id_fk" FOREIGN KEY ("tools_kettlebell_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_tools_dumbbell_image_id_media_id_fk" FOREIGN KEY ("tools_dumbbell_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_tools_kids_image_id_media_id_fk" FOREIGN KEY ("tools_kids_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_tools_stone_wood_image_id_media_id_fk" FOREIGN KEY ("tools_stone_wood_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_tools_material_image_id_media_id_fk" FOREIGN KEY ("tools_material_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_tools_care_image_id_media_id_fk" FOREIGN KEY ("tools_care_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_tools_custom_image_id_media_id_fk" FOREIGN KEY ("tools_custom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_events_hero_image_id_media_id_fk" FOREIGN KEY ("events_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_events_training_image_id_media_id_fk" FOREIGN KEY ("events_training_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_events_workshop_image_id_media_id_fk" FOREIGN KEY ("events_workshop_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_events_retreat_image_id_media_id_fk" FOREIGN KEY ("events_retreat_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_events_ritual_image_id_media_id_fk" FOREIGN KEY ("events_ritual_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_events_host_image_id_media_id_fk" FOREIGN KEY ("events_host_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_shop_hero_image_id_media_id_fk" FOREIGN KEY ("shop_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_about_hero_image_id_media_id_fk" FOREIGN KEY ("about_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_about_story_image_id_media_id_fk" FOREIGN KEY ("about_story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_about_trainer_image_id_media_id_fk" FOREIGN KEY ("about_trainer_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_journal_hero_image_id_media_id_fk" FOREIGN KEY ("journal_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_images" ADD CONSTRAINT "page_images_journal_signup_image_id_media_id_fk" FOREIGN KEY ("journal_signup_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "page_images_home_hero_image_idx" ON "page_images" USING btree ("home_hero_image_id");
  CREATE INDEX "page_images_home_philosophy_image_idx" ON "page_images" USING btree ("home_philosophy_image_id");
  CREATE INDEX "page_images_home_training_card_image_idx" ON "page_images" USING btree ("home_training_card_image_id");
  CREATE INDEX "page_images_home_tools_card_image_idx" ON "page_images" USING btree ("home_tools_card_image_id");
  CREATE INDEX "page_images_home_events_card_image_idx" ON "page_images" USING btree ("home_events_card_image_id");
  CREATE INDEX "page_images_home_about_card_image_idx" ON "page_images" USING btree ("home_about_card_image_id");
  CREATE INDEX "page_images_home_journal_card_image_idx" ON "page_images" USING btree ("home_journal_card_image_id");
  CREATE INDEX "page_images_training_hero_image_idx" ON "page_images" USING btree ("training_hero_image_id");
  CREATE INDEX "page_images_training_functional_image_idx" ON "page_images" USING btree ("training_functional_image_id");
  CREATE INDEX "page_images_training_nature_image_idx" ON "page_images" USING btree ("training_nature_image_id");
  CREATE INDEX "page_images_training_staying_image_idx" ON "page_images" USING btree ("training_staying_image_id");
  CREATE INDEX "page_images_training_private_image_idx" ON "page_images" USING btree ("training_private_image_id");
  CREATE INDEX "page_images_training_lasting_image_idx" ON "page_images" USING btree ("training_lasting_image_id");
  CREATE INDEX "page_images_tools_hero_image_idx" ON "page_images" USING btree ("tools_hero_image_id");
  CREATE INDEX "page_images_tools_stick_image_idx" ON "page_images" USING btree ("tools_stick_image_id");
  CREATE INDEX "page_images_tools_kettlebell_image_idx" ON "page_images" USING btree ("tools_kettlebell_image_id");
  CREATE INDEX "page_images_tools_dumbbell_image_idx" ON "page_images" USING btree ("tools_dumbbell_image_id");
  CREATE INDEX "page_images_tools_kids_image_idx" ON "page_images" USING btree ("tools_kids_image_id");
  CREATE INDEX "page_images_tools_stone_wood_image_idx" ON "page_images" USING btree ("tools_stone_wood_image_id");
  CREATE INDEX "page_images_tools_material_image_idx" ON "page_images" USING btree ("tools_material_image_id");
  CREATE INDEX "page_images_tools_care_image_idx" ON "page_images" USING btree ("tools_care_image_id");
  CREATE INDEX "page_images_tools_custom_image_idx" ON "page_images" USING btree ("tools_custom_image_id");
  CREATE INDEX "page_images_events_hero_image_idx" ON "page_images" USING btree ("events_hero_image_id");
  CREATE INDEX "page_images_events_training_image_idx" ON "page_images" USING btree ("events_training_image_id");
  CREATE INDEX "page_images_events_workshop_image_idx" ON "page_images" USING btree ("events_workshop_image_id");
  CREATE INDEX "page_images_events_retreat_image_idx" ON "page_images" USING btree ("events_retreat_image_id");
  CREATE INDEX "page_images_events_ritual_image_idx" ON "page_images" USING btree ("events_ritual_image_id");
  CREATE INDEX "page_images_events_host_image_idx" ON "page_images" USING btree ("events_host_image_id");
  CREATE INDEX "page_images_shop_hero_image_idx" ON "page_images" USING btree ("shop_hero_image_id");
  CREATE INDEX "page_images_about_hero_image_idx" ON "page_images" USING btree ("about_hero_image_id");
  CREATE INDEX "page_images_about_story_image_idx" ON "page_images" USING btree ("about_story_image_id");
  CREATE INDEX "page_images_about_trainer_image_idx" ON "page_images" USING btree ("about_trainer_image_id");
  CREATE INDEX "page_images_journal_hero_image_idx" ON "page_images" USING btree ("journal_hero_image_id");
  CREATE INDEX "page_images_journal_signup_image_idx" ON "page_images" USING btree ("journal_signup_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "page_images" CASCADE;`)
}
