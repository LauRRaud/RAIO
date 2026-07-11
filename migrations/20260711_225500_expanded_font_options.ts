import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      enum_name text;
      font_value text;
    BEGIN
      FOR enum_name IN
        SELECT type_name.typname
        FROM pg_type AS type_name
        INNER JOIN pg_namespace AS namespace
          ON namespace.oid = type_name.typnamespace
        WHERE namespace.nspname = 'public'
          AND type_name.typname ~ '^enum_page_editor_.*_font$'
      LOOP
        FOREACH font_value IN ARRAY ARRAY[
          'system', 'arial', 'helvetica', 'verdana', 'trebuchet', 'tahoma',
          'georgia', 'times', 'garamond', 'palatino', 'courier', 'lucida', 'impact'
        ]
        LOOP
          EXECUTE format(
            'ALTER TYPE public.%I ADD VALUE IF NOT EXISTS %L',
            enum_name,
            font_value
          );
        END LOOP;
      END LOOP;
    END;
    $$;
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // PostgreSQL cannot safely remove enum values in-place. Keeping the additional
  // values makes rollback non-destructive; older application versions ignore them.
  payload.logger.info('Expanded font enum values are intentionally retained on rollback.')
}
