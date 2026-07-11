import type { Field, GlobalConfig } from "payload";

import { authenticated } from "@/payload/access";

function guideField(name: string, label: string, value: string): Field {
  return {
    name,
    label,
    type: "textarea",
    defaultValue: value,
    admin: {
      readOnly: true,
      rows: value.split("\n").length + 1
    }
  };
}

export const AdminGuide: GlobalConfig = {
  slug: "admin-guide",
  label: "Alusta siit · kasutusjuhend",
  access: {
    read: authenticated,
    update: authenticated
  },
  admin: {
    group: "00 · ALUSTA SIIT",
    description: "Lühike eestikeelne juhend: millises admini osas mida muuta."
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Kiirjuhend",
          fields: [
            guideField(
              "startHere",
              "Kõige olulisem",
              "1. Lehe pealkirja, teksti, pilti, värvi või fonti muudad vaates „Lehtede sisu ja kujundus”.\n2. Vali ülevalt õige leht: Avaleht, Treeningud, Vahendid, Sündmused, Pood, Meist või Journal.\n3. Muuda väljal juba nähtavat praegust väärtust ja vajuta Save.\n4. Eesti ja inglise sisu vahetad paremal üleval Locale valikust.\n5. Kontrolli tulemust avalikul lehel."
            ),
            guideField(
              "safeEditing",
              "Turvaline muutmine",
              "Tekstiväljal on ees praegu avalikul lehel kasutatav tekst. Selle asendamine muudab avalikku lehte.\nPildi juures on ees praegu kasutatav pilt. Uue pildi saad valida nupust Choose from existing või laadida üles Create New kaudu.\nRoute'i ja URL-i ei ole vaja muuta.\nKui eksid, ära vajuta Save—laadi leht uuesti."
            )
          ]
        },
        {
          label: "Tekstid ja pildid",
          fields: [
            guideField(
              "pageContent",
              "Lehtede sisu ja kujundus",
              "MENÜÜ JA JALUS — päisemenüü nimed ning kõigi lehtede jalus.\nAVALEHT — hero, filosoofia, vahendite tutvustus ja suured lingikaardid.\nTREENINGUD — hero ning karusselli ümber olevad sektsioonid.\nVAHENDID — hero, kategooriate pealkiri, materjal ja hooldus.\nSÜNDMUSED — hero, sündmuste ala ja korraldamise üleskutse.\nPOOD — poe hero, toodete ala ja eritellimus.\nMEIST — hero, lugu, treenerid, väärtused ja kontakt.\nJOURNAL — hero, artiklite ala ja alumine üleskutse."
            ),
            guideField(
              "appearance",
              "Värvid ja fondid",
              "Iga sektsiooni lõpus on kujunduse väljad.\n„Sektsiooni taustavärv” muudab kogu vastava ploki tausta.\n„Teksti värv” muudab sama ploki teksti värvi.\nPealkirjade ja põhiteksti fonte saab valida eraldi.\nVärv sisesta HEX kujul, näiteks #17130f. Praegused värvid on väljadele juba lisatud."
            )
          ]
        },
        {
          label: "Kaardid ja pood",
          fields: [
            guideField(
              "collections",
              "Millist nimekirja kasutada?",
              "TOOTED — poe tootekaardid, hinnad, pildid ja kirjeldused.\nTREENINGUD — treeningute keritavad kaardid ja detailtekstid.\nSÜNDMUSED — sündmuste keritavad kaardid, asukoht ja kuupäev.\nVAHENDITE KAARDID — vahendite lehe kategooriakarussell.\nJOURNAL ARTIKLID — artiklikaardid ja artikli sisu.\nNendes vaadetes saad Create New abil uue kaardi lisada ning olemasoleval real klõpsates seda muuta."
            ),
            guideField(
              "visibility",
              "Nähtavus ja järjekord",
              "„Nähtav” määrab, kas kaart kuvatakse avalikul lehel.\n„Järjekord” määrab kaartide järjestuse: väiksem number kuvatakse eespool.\nToote või kaardi pildi muutmiseks ava vastav kirje, mitte „Lehtede sisu ja kujundus”."
            )
          ]
        }
      ]
    }
  ]
};
