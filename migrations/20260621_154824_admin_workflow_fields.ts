import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_priority" AS ENUM('normal', 'high', 'waiting');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'partial', 'paid', 'refunded');
  CREATE TYPE "public"."enum_events_event_type" AS ENUM('training', 'workshop', 'experience', 'private');
  CREATE TYPE "public"."enum_events_registration_status" AS ENUM('open', 'soon', 'full', 'closed');
  ALTER TABLE "orders" ADD COLUMN "priority" "enum_orders_priority" DEFAULT 'normal';
  ALTER TABLE "orders" ADD COLUMN "payment_status" "enum_orders_payment_status" DEFAULT 'pending';
  ALTER TABLE "orders" ADD COLUMN "deposit_paid" numeric;
  ALTER TABLE "orders" ADD COLUMN "target_ready_at" timestamp(3) with time zone;
  ALTER TABLE "products" ADD COLUMN "sku" varchar;
  ALTER TABLE "products" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "products" ADD COLUMN "sort_order" numeric DEFAULT 100;
  ALTER TABLE "events" ADD COLUMN "event_type" "enum_events_event_type" DEFAULT 'training';
  ALTER TABLE "events" ADD COLUMN "registration_status" "enum_events_registration_status" DEFAULT 'open';
  ALTER TABLE "events" ADD COLUMN "capacity" numeric;
  ALTER TABLE "events" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "events" ADD COLUMN "sort_order" numeric DEFAULT 100;
  ALTER TABLE "journal_articles" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "journal_articles" ADD COLUMN "sort_order" numeric DEFAULT 100;
  ALTER TABLE "journal_articles_locales" ADD COLUMN "reading_time" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "company_name" varchar DEFAULT 'Raio33Movement OÜ';
  ALTER TABLE "site_settings" ADD COLUMN "registry_code" varchar DEFAULT '17338447';
  CREATE UNIQUE INDEX "products_sku_idx" ON "products" USING btree ("sku");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "products_sku_idx";
  ALTER TABLE "orders" DROP COLUMN "priority";
  ALTER TABLE "orders" DROP COLUMN "payment_status";
  ALTER TABLE "orders" DROP COLUMN "deposit_paid";
  ALTER TABLE "orders" DROP COLUMN "target_ready_at";
  ALTER TABLE "products" DROP COLUMN "sku";
  ALTER TABLE "products" DROP COLUMN "featured";
  ALTER TABLE "products" DROP COLUMN "sort_order";
  ALTER TABLE "events" DROP COLUMN "event_type";
  ALTER TABLE "events" DROP COLUMN "registration_status";
  ALTER TABLE "events" DROP COLUMN "capacity";
  ALTER TABLE "events" DROP COLUMN "cta_url";
  ALTER TABLE "events" DROP COLUMN "sort_order";
  ALTER TABLE "journal_articles" DROP COLUMN "featured";
  ALTER TABLE "journal_articles" DROP COLUMN "sort_order";
  ALTER TABLE "journal_articles_locales" DROP COLUMN "reading_time";
  ALTER TABLE "site_settings" DROP COLUMN "company_name";
  ALTER TABLE "site_settings" DROP COLUMN "registry_code";
  DROP TYPE "public"."enum_orders_priority";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_events_event_type";
  DROP TYPE "public"."enum_events_registration_status";`)
}
