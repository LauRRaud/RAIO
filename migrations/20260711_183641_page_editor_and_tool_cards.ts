import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tool_cards_category" AS ENUM('sangpommid', 'hantlid', 'puidust-vahendid', 'lastele');
  CREATE TYPE "public"."enum_page_editor_home_cards_route" AS ENUM('/treeningud', '/vahendid', '/sundmused', '/pood', '/meist', '/journal');
  CREATE TYPE "public"."enum_page_editor_footer_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_footer_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_home_hero_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_home_hero_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_home_philosophy_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_home_philosophy_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_home_tools_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_home_tools_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_home_cards_style_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_home_cards_style_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_training_hero_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_training_hero_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_training_carousel_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_training_carousel_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_training_lasting_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_training_lasting_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_training_workshop_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_training_workshop_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_tools_hero_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_tools_hero_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_tools_carousel_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_tools_carousel_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_tools_material_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_tools_material_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_tools_care_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_tools_care_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_events_hero_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_events_hero_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_events_carousel_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_events_carousel_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_events_host_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_events_host_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_shop_hero_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_shop_hero_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_shop_products_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_shop_products_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_shop_custom_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_shop_custom_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_about_hero_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_about_hero_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_about_story_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_about_story_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_about_trainers_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_about_trainers_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_about_closing_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_about_closing_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_journal_hero_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_journal_hero_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_journal_carousel_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_journal_carousel_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_journal_signup_style_heading_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_page_editor_journal_signup_style_body_font" AS ENUM('inherit', 'posterama', 'sans', 'serif', 'mono');
  CREATE TABLE "tool_cards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"image_id" integer NOT NULL,
  	"category" "enum_tool_cards_category" NOT NULL,
  	"sort_order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tool_cards_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_editor_home_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route" "enum_page_editor_home_cards_route" NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "page_editor" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"footer_instagram_url" varchar,
  	"footer_style_background_color" varchar,
  	"footer_style_text_color" varchar,
  	"footer_style_heading_font" "enum_page_editor_footer_style_heading_font" DEFAULT 'inherit',
  	"footer_style_body_font" "enum_page_editor_footer_style_body_font" DEFAULT 'inherit',
  	"home_hero_image_id" integer,
  	"home_hero_mobile_image_id" integer,
  	"home_hero_style_background_color" varchar,
  	"home_hero_style_text_color" varchar,
  	"home_hero_style_heading_font" "enum_page_editor_home_hero_style_heading_font" DEFAULT 'inherit',
  	"home_hero_style_body_font" "enum_page_editor_home_hero_style_body_font" DEFAULT 'inherit',
  	"home_philosophy_image_id" integer,
  	"home_philosophy_style_background_color" varchar,
  	"home_philosophy_style_text_color" varchar,
  	"home_philosophy_style_heading_font" "enum_page_editor_home_philosophy_style_heading_font" DEFAULT 'inherit',
  	"home_philosophy_style_body_font" "enum_page_editor_home_philosophy_style_body_font" DEFAULT 'inherit',
  	"home_tools_image_id" integer,
  	"home_tools_style_background_color" varchar,
  	"home_tools_style_text_color" varchar,
  	"home_tools_style_heading_font" "enum_page_editor_home_tools_style_heading_font" DEFAULT 'inherit',
  	"home_tools_style_body_font" "enum_page_editor_home_tools_style_body_font" DEFAULT 'inherit',
  	"home_cards_style_style_background_color" varchar,
  	"home_cards_style_style_text_color" varchar,
  	"home_cards_style_style_heading_font" "enum_page_editor_home_cards_style_style_heading_font" DEFAULT 'inherit',
  	"home_cards_style_style_body_font" "enum_page_editor_home_cards_style_style_body_font" DEFAULT 'inherit',
  	"training_hero_image_id" integer,
  	"training_hero_mobile_image_id" integer,
  	"training_hero_style_background_color" varchar,
  	"training_hero_style_text_color" varchar,
  	"training_hero_style_heading_font" "enum_page_editor_training_hero_style_heading_font" DEFAULT 'inherit',
  	"training_hero_style_body_font" "enum_page_editor_training_hero_style_body_font" DEFAULT 'inherit',
  	"training_carousel_style_background_color" varchar,
  	"training_carousel_style_text_color" varchar,
  	"training_carousel_style_heading_font" "enum_page_editor_training_carousel_style_heading_font" DEFAULT 'inherit',
  	"training_carousel_style_body_font" "enum_page_editor_training_carousel_style_body_font" DEFAULT 'inherit',
  	"training_lasting_image_id" integer,
  	"training_lasting_style_background_color" varchar,
  	"training_lasting_style_text_color" varchar,
  	"training_lasting_style_heading_font" "enum_page_editor_training_lasting_style_heading_font" DEFAULT 'inherit',
  	"training_lasting_style_body_font" "enum_page_editor_training_lasting_style_body_font" DEFAULT 'inherit',
  	"training_workshop_style_background_color" varchar,
  	"training_workshop_style_text_color" varchar,
  	"training_workshop_style_heading_font" "enum_page_editor_training_workshop_style_heading_font" DEFAULT 'inherit',
  	"training_workshop_style_body_font" "enum_page_editor_training_workshop_style_body_font" DEFAULT 'inherit',
  	"tools_hero_image_id" integer,
  	"tools_hero_mobile_image_id" integer,
  	"tools_hero_style_background_color" varchar,
  	"tools_hero_style_text_color" varchar,
  	"tools_hero_style_heading_font" "enum_page_editor_tools_hero_style_heading_font" DEFAULT 'inherit',
  	"tools_hero_style_body_font" "enum_page_editor_tools_hero_style_body_font" DEFAULT 'inherit',
  	"tools_carousel_style_background_color" varchar,
  	"tools_carousel_style_text_color" varchar,
  	"tools_carousel_style_heading_font" "enum_page_editor_tools_carousel_style_heading_font" DEFAULT 'inherit',
  	"tools_carousel_style_body_font" "enum_page_editor_tools_carousel_style_body_font" DEFAULT 'inherit',
  	"tools_material_image_id" integer,
  	"tools_material_style_background_color" varchar,
  	"tools_material_style_text_color" varchar,
  	"tools_material_style_heading_font" "enum_page_editor_tools_material_style_heading_font" DEFAULT 'inherit',
  	"tools_material_style_body_font" "enum_page_editor_tools_material_style_body_font" DEFAULT 'inherit',
  	"tools_care_image_id" integer,
  	"tools_care_style_background_color" varchar,
  	"tools_care_style_text_color" varchar,
  	"tools_care_style_heading_font" "enum_page_editor_tools_care_style_heading_font" DEFAULT 'inherit',
  	"tools_care_style_body_font" "enum_page_editor_tools_care_style_body_font" DEFAULT 'inherit',
  	"events_hero_image_id" integer,
  	"events_hero_mobile_image_id" integer,
  	"events_hero_style_background_color" varchar,
  	"events_hero_style_text_color" varchar,
  	"events_hero_style_heading_font" "enum_page_editor_events_hero_style_heading_font" DEFAULT 'inherit',
  	"events_hero_style_body_font" "enum_page_editor_events_hero_style_body_font" DEFAULT 'inherit',
  	"events_carousel_style_background_color" varchar,
  	"events_carousel_style_text_color" varchar,
  	"events_carousel_style_heading_font" "enum_page_editor_events_carousel_style_heading_font" DEFAULT 'inherit',
  	"events_carousel_style_body_font" "enum_page_editor_events_carousel_style_body_font" DEFAULT 'inherit',
  	"events_host_image_id" integer,
  	"events_host_style_background_color" varchar,
  	"events_host_style_text_color" varchar,
  	"events_host_style_heading_font" "enum_page_editor_events_host_style_heading_font" DEFAULT 'inherit',
  	"events_host_style_body_font" "enum_page_editor_events_host_style_body_font" DEFAULT 'inherit',
  	"shop_hero_image_id" integer,
  	"shop_hero_mobile_image_id" integer,
  	"shop_hero_style_background_color" varchar,
  	"shop_hero_style_text_color" varchar,
  	"shop_hero_style_heading_font" "enum_page_editor_shop_hero_style_heading_font" DEFAULT 'inherit',
  	"shop_hero_style_body_font" "enum_page_editor_shop_hero_style_body_font" DEFAULT 'inherit',
  	"shop_products_style_background_color" varchar,
  	"shop_products_style_text_color" varchar,
  	"shop_products_style_heading_font" "enum_page_editor_shop_products_style_heading_font" DEFAULT 'inherit',
  	"shop_products_style_body_font" "enum_page_editor_shop_products_style_body_font" DEFAULT 'inherit',
  	"shop_custom_image_id" integer,
  	"shop_custom_style_background_color" varchar,
  	"shop_custom_style_text_color" varchar,
  	"shop_custom_style_heading_font" "enum_page_editor_shop_custom_style_heading_font" DEFAULT 'inherit',
  	"shop_custom_style_body_font" "enum_page_editor_shop_custom_style_body_font" DEFAULT 'inherit',
  	"about_hero_image_id" integer,
  	"about_hero_mobile_image_id" integer,
  	"about_hero_style_background_color" varchar,
  	"about_hero_style_text_color" varchar,
  	"about_hero_style_heading_font" "enum_page_editor_about_hero_style_heading_font" DEFAULT 'inherit',
  	"about_hero_style_body_font" "enum_page_editor_about_hero_style_body_font" DEFAULT 'inherit',
  	"about_story_image_id" integer,
  	"about_story_style_background_color" varchar,
  	"about_story_style_text_color" varchar,
  	"about_story_style_heading_font" "enum_page_editor_about_story_style_heading_font" DEFAULT 'inherit',
  	"about_story_style_body_font" "enum_page_editor_about_story_style_body_font" DEFAULT 'inherit',
  	"about_trainers_style_background_color" varchar,
  	"about_trainers_style_text_color" varchar,
  	"about_trainers_style_heading_font" "enum_page_editor_about_trainers_style_heading_font" DEFAULT 'inherit',
  	"about_trainers_style_body_font" "enum_page_editor_about_trainers_style_body_font" DEFAULT 'inherit',
  	"about_closing_style_background_color" varchar,
  	"about_closing_style_text_color" varchar,
  	"about_closing_style_heading_font" "enum_page_editor_about_closing_style_heading_font" DEFAULT 'inherit',
  	"about_closing_style_body_font" "enum_page_editor_about_closing_style_body_font" DEFAULT 'inherit',
  	"journal_hero_image_id" integer,
  	"journal_hero_mobile_image_id" integer,
  	"journal_hero_style_background_color" varchar,
  	"journal_hero_style_text_color" varchar,
  	"journal_hero_style_heading_font" "enum_page_editor_journal_hero_style_heading_font" DEFAULT 'inherit',
  	"journal_hero_style_body_font" "enum_page_editor_journal_hero_style_body_font" DEFAULT 'inherit',
  	"journal_carousel_style_background_color" varchar,
  	"journal_carousel_style_text_color" varchar,
  	"journal_carousel_style_heading_font" "enum_page_editor_journal_carousel_style_heading_font" DEFAULT 'inherit',
  	"journal_carousel_style_body_font" "enum_page_editor_journal_carousel_style_body_font" DEFAULT 'inherit',
  	"journal_signup_image_id" integer,
  	"journal_signup_style_background_color" varchar,
  	"journal_signup_style_text_color" varchar,
  	"journal_signup_style_heading_font" "enum_page_editor_journal_signup_style_heading_font" DEFAULT 'inherit',
  	"journal_signup_style_body_font" "enum_page_editor_journal_signup_style_body_font" DEFAULT 'inherit',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_editor_locales" (
  	"navigation_trainings" varchar,
  	"navigation_tools" varchar,
  	"navigation_events" varchar,
  	"navigation_shop" varchar,
  	"navigation_about" varchar,
  	"navigation_journal" varchar,
  	"footer_slogan" varchar,
  	"footer_instagram_label" varchar,
  	"home_hero_eyebrow" varchar,
  	"home_hero_title" varchar,
  	"home_hero_accent" varchar,
  	"home_hero_text" varchar,
  	"home_philosophy_eyebrow" varchar,
  	"home_philosophy_title" varchar,
  	"home_philosophy_accent" varchar,
  	"home_philosophy_text" varchar,
  	"home_tools_eyebrow" varchar,
  	"home_tools_title" varchar,
  	"home_tools_accent" varchar,
  	"home_tools_text" varchar,
  	"training_hero_eyebrow" varchar,
  	"training_hero_title" varchar,
  	"training_hero_accent" varchar,
  	"training_hero_text" varchar,
  	"training_carousel_title" varchar,
  	"training_carousel_cta" varchar,
  	"training_lasting_title" varchar,
  	"training_lasting_text" varchar,
  	"training_lasting_cta" varchar,
  	"training_workshop_title" varchar,
  	"training_workshop_text" varchar,
  	"training_workshop_cta" varchar,
  	"tools_hero_eyebrow" varchar,
  	"tools_hero_title" varchar,
  	"tools_hero_accent" varchar,
  	"tools_hero_text" varchar,
  	"tools_carousel_title" varchar,
  	"tools_carousel_cta" varchar,
  	"tools_material_title" varchar,
  	"tools_material_text" varchar,
  	"tools_care_title" varchar,
  	"tools_care_text" varchar,
  	"events_hero_eyebrow" varchar,
  	"events_hero_title" varchar,
  	"events_hero_accent" varchar,
  	"events_hero_text" varchar,
  	"events_carousel_title" varchar,
  	"events_carousel_cta" varchar,
  	"events_host_title" varchar,
  	"events_host_text" varchar,
  	"events_host_cta" varchar,
  	"shop_hero_eyebrow" varchar,
  	"shop_hero_title" varchar,
  	"shop_hero_accent" varchar,
  	"shop_hero_text" varchar,
  	"shop_products_title" varchar,
  	"shop_custom_title" varchar,
  	"shop_custom_text" varchar,
  	"shop_custom_cta" varchar,
  	"about_hero_eyebrow" varchar,
  	"about_hero_title" varchar,
  	"about_hero_accent" varchar,
  	"about_hero_text" varchar,
  	"about_story_title" varchar,
  	"about_story_text" varchar,
  	"about_trainers_title" varchar,
  	"about_closing_title" varchar,
  	"journal_hero_eyebrow" varchar,
  	"journal_hero_title" varchar,
  	"journal_hero_accent" varchar,
  	"journal_hero_text" varchar,
  	"journal_carousel_title" varchar,
  	"journal_carousel_cta" varchar,
  	"journal_signup_title" varchar,
  	"journal_signup_text" varchar,
  	"journal_signup_cta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tool_cards_id" integer;
  ALTER TABLE "tool_cards" ADD CONSTRAINT "tool_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tool_cards_locales" ADD CONSTRAINT "tool_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tool_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_editor_home_cards" ADD CONSTRAINT "page_editor_home_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor_home_cards" ADD CONSTRAINT "page_editor_home_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_editor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_home_hero_image_id_media_id_fk" FOREIGN KEY ("home_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_home_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("home_hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_home_philosophy_image_id_media_id_fk" FOREIGN KEY ("home_philosophy_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_home_tools_image_id_media_id_fk" FOREIGN KEY ("home_tools_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_training_hero_image_id_media_id_fk" FOREIGN KEY ("training_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_training_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("training_hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_training_lasting_image_id_media_id_fk" FOREIGN KEY ("training_lasting_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_tools_hero_image_id_media_id_fk" FOREIGN KEY ("tools_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_tools_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("tools_hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_tools_material_image_id_media_id_fk" FOREIGN KEY ("tools_material_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_tools_care_image_id_media_id_fk" FOREIGN KEY ("tools_care_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_events_hero_image_id_media_id_fk" FOREIGN KEY ("events_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_events_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("events_hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_events_host_image_id_media_id_fk" FOREIGN KEY ("events_host_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_shop_hero_image_id_media_id_fk" FOREIGN KEY ("shop_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_shop_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("shop_hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_shop_custom_image_id_media_id_fk" FOREIGN KEY ("shop_custom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_about_hero_image_id_media_id_fk" FOREIGN KEY ("about_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_about_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("about_hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_about_story_image_id_media_id_fk" FOREIGN KEY ("about_story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_journal_hero_image_id_media_id_fk" FOREIGN KEY ("journal_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_journal_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("journal_hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor" ADD CONSTRAINT "page_editor_journal_signup_image_id_media_id_fk" FOREIGN KEY ("journal_signup_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_editor_locales" ADD CONSTRAINT "page_editor_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_editor"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tool_cards_image_idx" ON "tool_cards" USING btree ("image_id");
  CREATE INDEX "tool_cards_updated_at_idx" ON "tool_cards" USING btree ("updated_at");
  CREATE INDEX "tool_cards_created_at_idx" ON "tool_cards" USING btree ("created_at");
  CREATE UNIQUE INDEX "tool_cards_locales_locale_parent_id_unique" ON "tool_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_editor_home_cards_order_idx" ON "page_editor_home_cards" USING btree ("_order");
  CREATE INDEX "page_editor_home_cards_parent_id_idx" ON "page_editor_home_cards" USING btree ("_parent_id");
  CREATE INDEX "page_editor_home_cards_locale_idx" ON "page_editor_home_cards" USING btree ("_locale");
  CREATE INDEX "page_editor_home_cards_image_idx" ON "page_editor_home_cards" USING btree ("image_id");
  CREATE INDEX "page_editor_home_hero_home_hero_image_idx" ON "page_editor" USING btree ("home_hero_image_id");
  CREATE INDEX "page_editor_home_hero_home_hero_mobile_image_idx" ON "page_editor" USING btree ("home_hero_mobile_image_id");
  CREATE INDEX "page_editor_home_philosophy_home_philosophy_image_idx" ON "page_editor" USING btree ("home_philosophy_image_id");
  CREATE INDEX "page_editor_home_tools_home_tools_image_idx" ON "page_editor" USING btree ("home_tools_image_id");
  CREATE INDEX "page_editor_training_hero_training_hero_image_idx" ON "page_editor" USING btree ("training_hero_image_id");
  CREATE INDEX "page_editor_training_hero_training_hero_mobile_image_idx" ON "page_editor" USING btree ("training_hero_mobile_image_id");
  CREATE INDEX "page_editor_training_lasting_training_lasting_image_idx" ON "page_editor" USING btree ("training_lasting_image_id");
  CREATE INDEX "page_editor_tools_hero_tools_hero_image_idx" ON "page_editor" USING btree ("tools_hero_image_id");
  CREATE INDEX "page_editor_tools_hero_tools_hero_mobile_image_idx" ON "page_editor" USING btree ("tools_hero_mobile_image_id");
  CREATE INDEX "page_editor_tools_material_tools_material_image_idx" ON "page_editor" USING btree ("tools_material_image_id");
  CREATE INDEX "page_editor_tools_care_tools_care_image_idx" ON "page_editor" USING btree ("tools_care_image_id");
  CREATE INDEX "page_editor_events_hero_events_hero_image_idx" ON "page_editor" USING btree ("events_hero_image_id");
  CREATE INDEX "page_editor_events_hero_events_hero_mobile_image_idx" ON "page_editor" USING btree ("events_hero_mobile_image_id");
  CREATE INDEX "page_editor_events_host_events_host_image_idx" ON "page_editor" USING btree ("events_host_image_id");
  CREATE INDEX "page_editor_shop_hero_shop_hero_image_idx" ON "page_editor" USING btree ("shop_hero_image_id");
  CREATE INDEX "page_editor_shop_hero_shop_hero_mobile_image_idx" ON "page_editor" USING btree ("shop_hero_mobile_image_id");
  CREATE INDEX "page_editor_shop_custom_shop_custom_image_idx" ON "page_editor" USING btree ("shop_custom_image_id");
  CREATE INDEX "page_editor_about_hero_about_hero_image_idx" ON "page_editor" USING btree ("about_hero_image_id");
  CREATE INDEX "page_editor_about_hero_about_hero_mobile_image_idx" ON "page_editor" USING btree ("about_hero_mobile_image_id");
  CREATE INDEX "page_editor_about_story_about_story_image_idx" ON "page_editor" USING btree ("about_story_image_id");
  CREATE INDEX "page_editor_journal_hero_journal_hero_image_idx" ON "page_editor" USING btree ("journal_hero_image_id");
  CREATE INDEX "page_editor_journal_hero_journal_hero_mobile_image_idx" ON "page_editor" USING btree ("journal_hero_mobile_image_id");
  CREATE INDEX "page_editor_journal_signup_journal_signup_image_idx" ON "page_editor" USING btree ("journal_signup_image_id");
  CREATE UNIQUE INDEX "page_editor_locales_locale_parent_id_unique" ON "page_editor_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tool_cards_fk" FOREIGN KEY ("tool_cards_id") REFERENCES "public"."tool_cards"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_tool_cards_id_idx" ON "payload_locked_documents_rels" USING btree ("tool_cards_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tool_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tool_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_editor_home_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_editor" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_editor_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tool_cards" CASCADE;
  DROP TABLE "tool_cards_locales" CASCADE;
  DROP TABLE "page_editor_home_cards" CASCADE;
  DROP TABLE "page_editor" CASCADE;
  DROP TABLE "page_editor_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tool_cards_fk";
  
  DROP INDEX "payload_locked_documents_rels_tool_cards_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tool_cards_id";
  DROP TYPE "public"."enum_tool_cards_category";
  DROP TYPE "public"."enum_page_editor_home_cards_route";
  DROP TYPE "public"."enum_page_editor_footer_style_heading_font";
  DROP TYPE "public"."enum_page_editor_footer_style_body_font";
  DROP TYPE "public"."enum_page_editor_home_hero_style_heading_font";
  DROP TYPE "public"."enum_page_editor_home_hero_style_body_font";
  DROP TYPE "public"."enum_page_editor_home_philosophy_style_heading_font";
  DROP TYPE "public"."enum_page_editor_home_philosophy_style_body_font";
  DROP TYPE "public"."enum_page_editor_home_tools_style_heading_font";
  DROP TYPE "public"."enum_page_editor_home_tools_style_body_font";
  DROP TYPE "public"."enum_page_editor_home_cards_style_style_heading_font";
  DROP TYPE "public"."enum_page_editor_home_cards_style_style_body_font";
  DROP TYPE "public"."enum_page_editor_training_hero_style_heading_font";
  DROP TYPE "public"."enum_page_editor_training_hero_style_body_font";
  DROP TYPE "public"."enum_page_editor_training_carousel_style_heading_font";
  DROP TYPE "public"."enum_page_editor_training_carousel_style_body_font";
  DROP TYPE "public"."enum_page_editor_training_lasting_style_heading_font";
  DROP TYPE "public"."enum_page_editor_training_lasting_style_body_font";
  DROP TYPE "public"."enum_page_editor_training_workshop_style_heading_font";
  DROP TYPE "public"."enum_page_editor_training_workshop_style_body_font";
  DROP TYPE "public"."enum_page_editor_tools_hero_style_heading_font";
  DROP TYPE "public"."enum_page_editor_tools_hero_style_body_font";
  DROP TYPE "public"."enum_page_editor_tools_carousel_style_heading_font";
  DROP TYPE "public"."enum_page_editor_tools_carousel_style_body_font";
  DROP TYPE "public"."enum_page_editor_tools_material_style_heading_font";
  DROP TYPE "public"."enum_page_editor_tools_material_style_body_font";
  DROP TYPE "public"."enum_page_editor_tools_care_style_heading_font";
  DROP TYPE "public"."enum_page_editor_tools_care_style_body_font";
  DROP TYPE "public"."enum_page_editor_events_hero_style_heading_font";
  DROP TYPE "public"."enum_page_editor_events_hero_style_body_font";
  DROP TYPE "public"."enum_page_editor_events_carousel_style_heading_font";
  DROP TYPE "public"."enum_page_editor_events_carousel_style_body_font";
  DROP TYPE "public"."enum_page_editor_events_host_style_heading_font";
  DROP TYPE "public"."enum_page_editor_events_host_style_body_font";
  DROP TYPE "public"."enum_page_editor_shop_hero_style_heading_font";
  DROP TYPE "public"."enum_page_editor_shop_hero_style_body_font";
  DROP TYPE "public"."enum_page_editor_shop_products_style_heading_font";
  DROP TYPE "public"."enum_page_editor_shop_products_style_body_font";
  DROP TYPE "public"."enum_page_editor_shop_custom_style_heading_font";
  DROP TYPE "public"."enum_page_editor_shop_custom_style_body_font";
  DROP TYPE "public"."enum_page_editor_about_hero_style_heading_font";
  DROP TYPE "public"."enum_page_editor_about_hero_style_body_font";
  DROP TYPE "public"."enum_page_editor_about_story_style_heading_font";
  DROP TYPE "public"."enum_page_editor_about_story_style_body_font";
  DROP TYPE "public"."enum_page_editor_about_trainers_style_heading_font";
  DROP TYPE "public"."enum_page_editor_about_trainers_style_body_font";
  DROP TYPE "public"."enum_page_editor_about_closing_style_heading_font";
  DROP TYPE "public"."enum_page_editor_about_closing_style_body_font";
  DROP TYPE "public"."enum_page_editor_journal_hero_style_heading_font";
  DROP TYPE "public"."enum_page_editor_journal_hero_style_body_font";
  DROP TYPE "public"."enum_page_editor_journal_carousel_style_heading_font";
  DROP TYPE "public"."enum_page_editor_journal_carousel_style_body_font";
  DROP TYPE "public"."enum_page_editor_journal_signup_style_heading_font";
  DROP TYPE "public"."enum_page_editor_journal_signup_style_body_font";`)
}
