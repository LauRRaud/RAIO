import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Optional YouTube link on every surface that can show one:
 *
 *  - four framed "image + copy" bands (page_editor): the training page's
 *    lasting band, the tools page's material band, the events page's host
 *    band and the about page's story band;
 *  - the three collections whose cards open a modal: trainings, events and
 *    journal articles.
 *
 * ALL COLUMNS ARE NON-LOCALIZED, deliberately. The same clip normally serves
 * both languages, and — more importantly — a localized field on page_editor
 * would land in page_editor_locales, which is already at 81 columns. Payload
 * reads a localized row with a single `json_build_array(...)`, and Postgres
 * caps that at 100 arguments (SQLSTATE 54023); that is exactly what broke the
 * admin when the host-event content was first attempted there (see
 * 20260727_150000). page_editor itself has no such limit.
 *
 * Written by hand — `npx payload migrate:create` is broken on this Windows/tsx
 * setup. Column names follow Payload's group flattening: group
 * `trainingLasting` + field `video` -> `training_lasting_video`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "page_editor"
      ADD COLUMN IF NOT EXISTS "training_lasting_video" varchar,
      ADD COLUMN IF NOT EXISTS "tools_material_video" varchar,
      ADD COLUMN IF NOT EXISTS "events_host_video" varchar,
      ADD COLUMN IF NOT EXISTS "about_story_video" varchar;

    ALTER TABLE "trainings" ADD COLUMN IF NOT EXISTS "video_url" varchar;
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "video_url" varchar;
    ALTER TABLE "journal_articles" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "page_editor"
      DROP COLUMN IF EXISTS "training_lasting_video",
      DROP COLUMN IF EXISTS "tools_material_video",
      DROP COLUMN IF EXISTS "events_host_video",
      DROP COLUMN IF EXISTS "about_story_video";

    ALTER TABLE "trainings" DROP COLUMN IF EXISTS "video_url";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "video_url";
    ALTER TABLE "journal_articles" DROP COLUMN IF EXISTS "video_url";
  `)
}
