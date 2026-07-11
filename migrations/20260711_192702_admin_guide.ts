import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "admin_guide" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"start_here" varchar DEFAULT '1. Lehe pealkirja, teksti, pilti, värvi või fonti muudad vaates „Lehtede sisu ja kujundus”.
  2. Vali ülevalt õige leht: Avaleht, Treeningud, Vahendid, Sündmused, Pood, Meist või Journal.
  3. Muuda väljal juba nähtavat praegust väärtust ja vajuta Save.
  4. Eesti ja inglise sisu vahetad paremal üleval Locale valikust.
  5. Kontrolli tulemust avalikul lehel.',
  	"safe_editing" varchar DEFAULT 'Tekstiväljal on ees praegu avalikul lehel kasutatav tekst. Selle asendamine muudab avalikku lehte.
  Pildi juures on ees praegu kasutatav pilt. Uue pildi saad valida nupust Choose from existing või laadida üles Create New kaudu.
  Route''i ja URL-i ei ole vaja muuta.
  Kui eksid, ära vajuta Save—laadi leht uuesti.',
  	"page_content" varchar DEFAULT 'MENÜÜ JA JALUS — päisemenüü nimed ning kõigi lehtede jalus.
  AVALEHT — hero, filosoofia, vahendite tutvustus ja suured lingikaardid.
  TREENINGUD — hero ning karusselli ümber olevad sektsioonid.
  VAHENDID — hero, kategooriate pealkiri, materjal ja hooldus.
  SÜNDMUSED — hero, sündmuste ala ja korraldamise üleskutse.
  POOD — poe hero, toodete ala ja eritellimus.
  MEIST — hero, lugu, treenerid, väärtused ja kontakt.
  JOURNAL — hero, artiklite ala ja alumine üleskutse.',
  	"appearance" varchar DEFAULT 'Iga sektsiooni lõpus on kujunduse väljad.
  „Sektsiooni taustavärv” muudab kogu vastava ploki tausta.
  „Teksti värv” muudab sama ploki teksti värvi.
  Pealkirjade ja põhiteksti fonte saab valida eraldi.
  Värv sisesta HEX kujul, näiteks #17130f. Praegused värvid on väljadele juba lisatud.',
  	"collections" varchar DEFAULT 'TOOTED — poe tootekaardid, hinnad, pildid ja kirjeldused.
  TREENINGUD — treeningute keritavad kaardid ja detailtekstid.
  SÜNDMUSED — sündmuste keritavad kaardid, asukoht ja kuupäev.
  VAHENDITE KAARDID — vahendite lehe kategooriakarussell.
  JOURNAL ARTIKLID — artiklikaardid ja artikli sisu.
  Nendes vaadetes saad Create New abil uue kaardi lisada ning olemasoleval real klõpsates seda muuta.',
  	"visibility" varchar DEFAULT '„Nähtav” määrab, kas kaart kuvatakse avalikul lehel.
  „Järjekord” määrab kaartide järjestuse: väiksem number kuvatakse eespool.
  Toote või kaardi pildi muutmiseks ava vastav kirje, mitte „Lehtede sisu ja kujundus”.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admin_guide" CASCADE;`)
}
