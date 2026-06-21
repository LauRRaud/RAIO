import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

export const Trainings: CollectionConfig = {
  slug: "trainings",
  labels: {
    singular: "Treening",
    plural: "Treeningud"
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
    group: "Sisu",
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
