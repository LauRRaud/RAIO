import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the per-section "Tekstide suurus" knob (styleTextScale) that sits beside
 * the existing colour/font appearance fields.
 *
 * The section groups are generated in code (appearanceFields() in
 * payload/globals/PageEditor.ts), so rather than spelling out all 26 of them the
 * migration derives the list from the columns that already exist: every
 * `<section>_style_heading_font` column implies a `<section>_style_text_scale`
 * sibling. That way a section added later can't be silently missed here.
 *
 * Payload names select enums `enum_<table>_<column>`, so the type name is built
 * the same way to stay consistent with the columns Payload generates itself.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      font_column text;
      scale_column text;
      enum_type text;
    BEGIN
      FOR font_column IN
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'page_editor'
          AND column_name LIKE '%\_style\_heading\_font'
      LOOP
        scale_column := left(font_column, length(font_column) - length('_heading_font')) || '_text_scale';
        enum_type := 'enum_page_editor_' || scale_column;

        IF length(enum_type) > 63 THEN
          RAISE EXCEPTION 'Enum name % exceeds the 63-char identifier limit', enum_type;
        END IF;

        IF NOT EXISTS (
          SELECT 1
          FROM pg_type AS t
          INNER JOIN pg_namespace AS n ON n.oid = t.typnamespace
          WHERE n.nspname = 'public' AND t.typname = enum_type
        ) THEN
          EXECUTE format(
            'CREATE TYPE public.%I AS ENUM (%L, %L, %L, %L, %L)',
            enum_type, '0.9', '1', '1.1', '1.25', '1.5'
          );
        END IF;

        EXECUTE format(
          'ALTER TABLE public.page_editor ADD COLUMN IF NOT EXISTS %I public.%I DEFAULT %L',
          scale_column, enum_type, '1'
        );
      END LOOP;
    END;
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      scale_column text;
      enum_type text;
    BEGIN
      FOR scale_column IN
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'page_editor'
          AND column_name LIKE '%\_style\_text\_scale'
      LOOP
        enum_type := 'enum_page_editor_' || scale_column;
        EXECUTE format('ALTER TABLE public.page_editor DROP COLUMN IF EXISTS %I', scale_column);
        EXECUTE format('DROP TYPE IF EXISTS public.%I', enum_type);
      END LOOP;
    END;
    $$;
  `)
}
