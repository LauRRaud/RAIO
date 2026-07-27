import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds an optional "duration · group size · price" line to each of the three
 * formats in the "Korralda sündmus" modal (host-event global).
 *
 * ONE free-text column per format rather than three typed ones (duration,
 * group, price): the pricing model is still open — per person, per hour or a
 * package — and free text carries all of them without a migration per change.
 *
 * Localized, so the columns live on host_event_locales. That table sits at 23
 * columns; +3 is nowhere near Postgres's 100-argument cap that forced this
 * content into its own global in the first place (see 20260727_150000).
 *
 * Written by hand — `npx payload migrate:create` is broken on this Windows/tsx
 * setup. Column names follow Payload's group flattening: group `formats` +
 * field `formatOneMeta` -> `formats_format_one_meta`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "host_event_locales"
      ADD COLUMN IF NOT EXISTS "formats_format_one_meta" varchar,
      ADD COLUMN IF NOT EXISTS "formats_format_two_meta" varchar,
      ADD COLUMN IF NOT EXISTS "formats_format_three_meta" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "host_event_locales"
      DROP COLUMN IF EXISTS "formats_format_one_meta",
      DROP COLUMN IF EXISTS "formats_format_two_meta",
      DROP COLUMN IF EXISTS "formats_format_three_meta";
  `)
}
