import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

export const Trainings: CollectionConfig = {
  slug: "trainings",
  labels: {
    singular: "Treeningukaart",
    plural: "Treeningukaardid"
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "duration", "level", "visible"],
    group: "02 · KAARDID JA POOD",
    description: "Treeningute lehe keritava menüü kaardid ja modaali detailne sisu."
  },
  fields: [
    {
      name: "title",
      label: "Pealkiri",
      type: "text",
      localized: true,
      required: true
    },
    {
      name: "description",
      label: "Luhikirjeldus",
      type: "textarea",
      localized: true,
      required: true
    },
    {
      name: "duration",
      label: "Kestus",
      type: "text",
      localized: true
    },
    {
      name: "level",
      label: "Tase",
      type: "text",
      localized: true
    },
    {
      name: "image",
      label: "Pilt",
      type: "upload",
      relationTo: "media"
    },
    {
      /* Keelestamata: sama klipp sobib mõlemasse keelde ja hoiab
         *_locales tabeli kitsana. Tühi väli = modaalis videot ei ole. */
      name: "videoUrl",
      label: "Video (YouTube'i link)",
      type: "text",
      admin: {
        description:
          "Kleebi tavaline YouTube'i link. Video ilmub modaali kaardipildi kohale ja avaneb alles vajutamisel. Tühjaks jättes videot ei kuvata.",
        placeholder: "https://www.youtube.com/watch?v=..."
      }
    },
    {
      name: "content",
      label: "Modali detailne sisu",
      type: "richText",
      localized: true,
      admin: {
        description: "See tekst kuvatakse siis, kui kasutaja avab treeningu kaardi modaali."
      }
    },
    {
      name: "sortOrder",
      label: "Jarjekord",
      type: "number",
      defaultValue: 100
    },
    {
      name: "visible",
      label: "Nahtav",
      type: "checkbox",
      defaultValue: true
    }
  ]
};
