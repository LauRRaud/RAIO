import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Lisab orders tabelisse Maksekeskuse makseväljad (vt payload/collections/Orders.ts
 * "Maksekeskus" collapsible). Kõik veerud on nullable — käsitsi sisestatud
 * tellimustel jäävad need tühjaks.
 *
 * Käsitsi kirjutatud, sest `npx payload migrate:create` on selles
 * Windows/tsx keskkonnas katki (ENOENT node:crypto?tsx-namespace=).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "maksekeskus_transaction_id" varchar;
   ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "maksekeskus_status" varchar;
   ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "payment_method" varchar;
   ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "paid_at" timestamp(3) with time zone;
   ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "paid_amount" numeric;

   CREATE INDEX IF NOT EXISTS "orders_maksekeskus_transaction_id_idx" ON "orders" USING btree ("maksekeskus_transaction_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "orders_maksekeskus_transaction_id_idx";

   ALTER TABLE "orders" DROP COLUMN IF EXISTS "maksekeskus_transaction_id";
   ALTER TABLE "orders" DROP COLUMN IF EXISTS "maksekeskus_status";
   ALTER TABLE "orders" DROP COLUMN IF EXISTS "payment_method";
   ALTER TABLE "orders" DROP COLUMN IF EXISTS "paid_at";
   ALTER TABLE "orders" DROP COLUMN IF EXISTS "paid_amount";
  `)
}
