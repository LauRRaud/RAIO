import type { Field, GlobalConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

function imageField(name: string, label: string): Field {
  return {
    name,
    label,
    type: "upload",
    relationTo: "media"
  };
}

export const PageImages: GlobalConfig = {
  slug: "page-images",
  label: "Lehtede pildid",
  access: {
    read: anyone,
    update: authenticated
  },
  admin: {
    group: "Sisu",
    description: "Avalike lehtede pildid, mida saab arvutist ules laaditud failidega asendada."
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Avaleht",
          fields: [
            imageField("homeHeroImage", "Hero pilt"),
            imageField("homePhilosophyImage", "Slogani sektsiooni pilt"),
            imageField("homeTrainingCardImage", "Kaart: Treeningud"),
            imageField("homeToolsCardImage", "Kaart: Vahendid"),
            imageField("homeEventsCardImage", "Kaart: Sundmused"),
            imageField("homeAboutCardImage", "Kaart: Meist"),
            imageField("homeJournalCardImage", "Kaart: Journal")
          ]
        },
        {
          label: "Treeningud",
          fields: [
            imageField("trainingHeroImage", "Hero pilt"),
            imageField("trainingFunctionalImage", "Treeningu kaart 1"),
            imageField("trainingNatureImage", "Treeningu kaart 2"),
            imageField("trainingStayingImage", "Treeningu kaart 3"),
            imageField("trainingPrivateImage", "Treeningu kaart 4"),
            imageField("trainingLastingImage", "Lisasektsiooni pilt")
          ]
        },
        {
          label: "Vahendid",
          fields: [
            imageField("toolsHeroImage", "Hero pilt"),
            imageField("toolsStickImage", "Kategooria: Treeningnui / sau"),
            imageField("toolsKettlebellImage", "Kategooria: Sangpommid"),
            imageField("toolsDumbbellImage", "Kategooria: Hantlid"),
            imageField("toolsKidsImage", "Kategooria: Laste vahendid"),
            imageField("toolsStoneWoodImage", "Kategooria: Kivi ja puit"),
            imageField("toolsMaterialImage", "Materjali sektsiooni pilt"),
            imageField("toolsCareImage", "Hoolduse pilt"),
            imageField("toolsCustomImage", "Eritellimuse pilt")
          ]
        },
        {
          label: "Sundmused",
          fields: [
            imageField("eventsHeroImage", "Hero pilt"),
            imageField("eventsTrainingImage", "Sundmuse kaart 1"),
            imageField("eventsWorkshopImage", "Sundmuse kaart 2"),
            imageField("eventsRetreatImage", "Sundmuse kaart 3"),
            imageField("eventsRitualImage", "Sundmuse kaart 4"),
            imageField("eventsHostImage", "Korraldamise sektsiooni pilt")
          ]
        },
        {
          label: "Pood",
          fields: [imageField("shopHeroImage", "Poe hero pilt")]
        },
        {
          label: "Meist",
          fields: [
            imageField("aboutHeroImage", "Hero pilt"),
            imageField("aboutStoryImage", "Loo sektsiooni pilt"),
            imageField("aboutTrainerImage", "Treeneri pilt")
          ]
        },
        {
          label: "Journal",
          fields: [
            imageField("journalHeroImage", "Hero pilt"),
            imageField("journalSignupImage", "Alumise sektsiooni pilt")
          ]
        }
      ]
    }
  ]
};
