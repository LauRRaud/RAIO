import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Makes the per-page share image (`seo.<page>.shareImage`) LOCALIZED, i.e.
 * moves seven upload columns from `seo` into `seo_locales`.
 *
 * Why: the share card carries the page name as artwork ("SÜNDMUSED" /
 * "EVENTS"), so it is public text and the project rule is that every public
 * text exists in both languages (CLAUDE.md). With one non-localized column the
 * English pages were forced to show the Estonian card; scripts/
 * generate-og-cards.mjs has been writing public/og/en/ cards all along with
 * nowhere to put them.
 *
 * The existing value is COPIED INTO EVERY LOCALE ROW before the old column is
 * dropped. Without that, both languages would fall back to the general share
 * image the moment this migration ran — a silent regression on seven live
 * pages. English then gets its own card from `npm run seed:og`, overwriting
 * the Estonian one it starts with.
 *
 * `default_share_image_id` stays non-localized on purpose: it carries no text,
 * only a photo, and it is the fallback for pages that have no card at all.
 *
 * `host_event_share_image_id` is deliberately untouched — it is a leftover
 * from a short-lived host-event SEO page and no longer exists in Seo.ts.
 *
 * Written by hand — `npx payload migrate:create` is broken on this
 * Windows/tsx setup (ENOENT node:crypto?tsx-namespace=). Column names follow
 * Payload's group flattening: group `events` + field `shareImage` ->
 * `events_share_image_id`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "seo_locales"
      ADD COLUMN IF NOT EXISTS "home_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "training_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "tools_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "events_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "journal_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "shop_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "about_share_image_id" integer;

    UPDATE "seo_locales" AS l SET
      "home_share_image_id" = s."home_share_image_id",
      "training_share_image_id" = s."training_share_image_id",
      "tools_share_image_id" = s."tools_share_image_id",
      "events_share_image_id" = s."events_share_image_id",
      "journal_share_image_id" = s."journal_share_image_id",
      "shop_share_image_id" = s."shop_share_image_id",
      "about_share_image_id" = s."about_share_image_id"
    FROM "seo" AS s
    WHERE l."_parent_id" = s."id";

    ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_home_share_image_id_media_id_fk" FOREIGN KEY ("home_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_training_share_image_id_media_id_fk" FOREIGN KEY ("training_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_tools_share_image_id_media_id_fk" FOREIGN KEY ("tools_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_events_share_image_id_media_id_fk" FOREIGN KEY ("events_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_journal_share_image_id_media_id_fk" FOREIGN KEY ("journal_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_shop_share_image_id_media_id_fk" FOREIGN KEY ("shop_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_about_share_image_id_media_id_fk" FOREIGN KEY ("about_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "seo"
      DROP COLUMN IF EXISTS "home_share_image_id",
      DROP COLUMN IF EXISTS "training_share_image_id",
      DROP COLUMN IF EXISTS "tools_share_image_id",
      DROP COLUMN IF EXISTS "events_share_image_id",
      DROP COLUMN IF EXISTS "journal_share_image_id",
      DROP COLUMN IF EXISTS "shop_share_image_id",
      DROP COLUMN IF EXISTS "about_share_image_id";
  `)
}

/**
 * Back to one image per page. The Estonian row wins, because Estonian is the
 * primary locale and its card is the one the owner picked first; English
 * choices are lost, which is what un-localizing a field means.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "seo"
      ADD COLUMN IF NOT EXISTS "home_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "training_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "tools_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "events_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "journal_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "shop_share_image_id" integer,
      ADD COLUMN IF NOT EXISTS "about_share_image_id" integer;

    UPDATE "seo" AS s SET
      "home_share_image_id" = l."home_share_image_id",
      "training_share_image_id" = l."training_share_image_id",
      "tools_share_image_id" = l."tools_share_image_id",
      "events_share_image_id" = l."events_share_image_id",
      "journal_share_image_id" = l."journal_share_image_id",
      "shop_share_image_id" = l."shop_share_image_id",
      "about_share_image_id" = l."about_share_image_id"
    FROM "seo_locales" AS l
    WHERE l."_parent_id" = s."id" AND l."_locale" = 'et';

    ALTER TABLE "seo" ADD CONSTRAINT "seo_home_share_image_id_media_id_fk" FOREIGN KEY ("home_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo" ADD CONSTRAINT "seo_training_share_image_id_media_id_fk" FOREIGN KEY ("training_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo" ADD CONSTRAINT "seo_tools_share_image_id_media_id_fk" FOREIGN KEY ("tools_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo" ADD CONSTRAINT "seo_events_share_image_id_media_id_fk" FOREIGN KEY ("events_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo" ADD CONSTRAINT "seo_journal_share_image_id_media_id_fk" FOREIGN KEY ("journal_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo" ADD CONSTRAINT "seo_shop_share_image_id_media_id_fk" FOREIGN KEY ("shop_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "seo" ADD CONSTRAINT "seo_about_share_image_id_media_id_fk" FOREIGN KEY ("about_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "seo_locales"
      DROP COLUMN IF EXISTS "home_share_image_id",
      DROP COLUMN IF EXISTS "training_share_image_id",
      DROP COLUMN IF EXISTS "tools_share_image_id",
      DROP COLUMN IF EXISTS "events_share_image_id",
      DROP COLUMN IF EXISTS "journal_share_image_id",
      DROP COLUMN IF EXISTS "shop_share_image_id",
      DROP COLUMN IF EXISTS "about_share_image_id";
  `)
}
