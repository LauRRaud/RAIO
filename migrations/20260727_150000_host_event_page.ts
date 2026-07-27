import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the "Korralda oma sündmus" sub-page (/sundmused/korralda):
 *
 *  - a dedicated `host-event` global (tables host_event + host_event_locales)
 *    holding the hero, three formats, four steps, the notes list and the
 *    closing CTA;
 *  - the same page as an SEO-editable entry in the `seo` global plus its
 *    sitemap toggle.
 *
 * WHY ITS OWN GLOBAL and not another tab under page-editor: Payload reads a
 * localized row with a single `json_build_array(...)`, and Postgres caps that
 * at 100 arguments (SQLSTATE 54023). page_editor_locales was already at 83
 * columns; these 24 fields pushed the admin over the limit and every read of
 * page-editor failed. Give a new page its own global — do not grow page_editor.
 *
 * Written by hand — `npx payload migrate:create` is broken on this Windows/tsx
 * setup. Column names follow Payload's group flattening (group `formats` +
 * field `formatOneTitle` -> `formats_format_one_title`); verified against the
 * SQL Payload itself generates.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      section text;
      font_field text;
    BEGIN
      FOREACH section IN ARRAY ARRAY['hero', 'formats', 'process', 'closing']
      LOOP
        FOREACH font_field IN ARRAY ARRAY['heading_font', 'body_font']
        LOOP
          IF NOT EXISTS (
            SELECT 1 FROM pg_type t
            INNER JOIN pg_namespace n ON n.oid = t.typnamespace
            WHERE n.nspname = 'public' AND t.typname = 'enum_host_event_' || section || '_style_' || font_field
          ) THEN
            EXECUTE format(
              'CREATE TYPE public.%I AS ENUM (%L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L)',
              'enum_host_event_' || section || '_style_' || font_field,
              'inherit', 'posterama', 'sans', 'serif', 'mono', 'system', 'arial', 'helvetica', 'verdana',
              'trebuchet', 'tahoma', 'georgia', 'times', 'garamond', 'palatino', 'courier', 'lucida', 'impact'
            );
          END IF;
        END LOOP;

        IF NOT EXISTS (
          SELECT 1 FROM pg_type t
          INNER JOIN pg_namespace n ON n.oid = t.typnamespace
          WHERE n.nspname = 'public' AND t.typname = 'enum_host_event_' || section || '_style_text_scale'
        ) THEN
          EXECUTE format(
            'CREATE TYPE public.%I AS ENUM (%L, %L, %L, %L, %L)',
            'enum_host_event_' || section || '_style_text_scale', '0.9', '1', '1.1', '1.25', '1.5'
          );
        END IF;
      END LOOP;
    END;
    $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "host_event" (
      "id" serial PRIMARY KEY NOT NULL,
      "hero_image_id" integer,
      "hero_mobile_image_id" integer,
      "hero_style_background_color" varchar,
      "hero_style_text_color" varchar,
      "hero_style_heading_font" "enum_host_event_hero_style_heading_font" DEFAULT 'inherit',
      "hero_style_body_font" "enum_host_event_hero_style_body_font" DEFAULT 'inherit',
      "hero_style_text_scale" "enum_host_event_hero_style_text_scale" DEFAULT '1',
      "formats_style_background_color" varchar,
      "formats_style_text_color" varchar,
      "formats_style_heading_font" "enum_host_event_formats_style_heading_font" DEFAULT 'inherit',
      "formats_style_body_font" "enum_host_event_formats_style_body_font" DEFAULT 'inherit',
      "formats_style_text_scale" "enum_host_event_formats_style_text_scale" DEFAULT '1',
      "process_style_background_color" varchar,
      "process_style_text_color" varchar,
      "process_style_heading_font" "enum_host_event_process_style_heading_font" DEFAULT 'inherit',
      "process_style_body_font" "enum_host_event_process_style_body_font" DEFAULT 'inherit',
      "process_style_text_scale" "enum_host_event_process_style_text_scale" DEFAULT '1',
      "closing_style_background_color" varchar,
      "closing_style_text_color" varchar,
      "closing_style_heading_font" "enum_host_event_closing_style_heading_font" DEFAULT 'inherit',
      "closing_style_body_font" "enum_host_event_closing_style_body_font" DEFAULT 'inherit',
      "closing_style_text_scale" "enum_host_event_closing_style_text_scale" DEFAULT '1',
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "host_event_locales" (
      "hero_title" varchar,
      "hero_text" varchar,
      "formats_title" varchar,
      "formats_format_one_title" varchar,
      "formats_format_one_text" varchar,
      "formats_format_two_title" varchar,
      "formats_format_two_text" varchar,
      "formats_format_three_title" varchar,
      "formats_format_three_text" varchar,
      "process_title" varchar,
      "process_step_one_title" varchar,
      "process_step_one_text" varchar,
      "process_step_two_title" varchar,
      "process_step_two_text" varchar,
      "process_step_three_title" varchar,
      "process_step_three_text" varchar,
      "process_step_four_title" varchar,
      "process_step_four_text" varchar,
      "process_notes_title" varchar,
      "process_notes" varchar,
      "closing_title" varchar,
      "closing_text" varchar,
      "closing_cta" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    ALTER TABLE "seo" ADD COLUMN IF NOT EXISTS "host_event_share_image_id" integer;
    ALTER TABLE "seo" ADD COLUMN IF NOT EXISTS "sitemap_host_event" boolean DEFAULT true;
    ALTER TABLE "seo_locales" ADD COLUMN IF NOT EXISTS "host_event_title" varchar;
    ALTER TABLE "seo_locales" ADD COLUMN IF NOT EXISTS "host_event_description" varchar;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'host_event_hero_image_id_media_id_fk') THEN
        ALTER TABLE "host_event" ADD CONSTRAINT "host_event_hero_image_id_media_id_fk"
          FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'host_event_hero_mobile_image_id_media_id_fk') THEN
        ALTER TABLE "host_event" ADD CONSTRAINT "host_event_hero_mobile_image_id_media_id_fk"
          FOREIGN KEY ("hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'host_event_locales_parent_id_fk') THEN
        ALTER TABLE "host_event_locales" ADD CONSTRAINT "host_event_locales_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."host_event"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'seo_host_event_share_image_id_media_id_fk') THEN
        ALTER TABLE "seo" ADD CONSTRAINT "seo_host_event_share_image_id_media_id_fk"
          FOREIGN KEY ("host_event_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END;
    $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "host_event_locales_locale_parent_id_unique" ON "host_event_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "host_event_locales" CASCADE;
    DROP TABLE IF EXISTS "host_event" CASCADE;

    ALTER TABLE "seo" DROP COLUMN IF EXISTS "host_event_share_image_id";
    ALTER TABLE "seo" DROP COLUMN IF EXISTS "sitemap_host_event";
    ALTER TABLE "seo_locales" DROP COLUMN IF EXISTS "host_event_title";
    ALTER TABLE "seo_locales" DROP COLUMN IF EXISTS "host_event_description";
  `)

  await db.execute(sql`
    DO $$
    DECLARE
      enum_type text;
    BEGIN
      FOR enum_type IN
        SELECT t.typname FROM pg_type t
        INNER JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public' AND t.typname LIKE 'enum\_host\_event\_%'
      LOOP
        EXECUTE format('DROP TYPE IF EXISTS public.%I', enum_type);
      END LOOP;
    END;
    $$;
  `)
}
