import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

export const Events: CollectionConfig = {
  slug: "events",
  labels: {
    singular: "Sündmus",
    plural: "Sündmused"
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "location", "visible"],
    group: "Sisu"
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
      name: "date",
      label: "Kuupäev",
      type: "date"
    },
    {
      name: "location",
      label: "Asukoht",
      type: "text",
      localized: true
    },
    {
      name: "description",
      label: "Kirjeldus",
      type: "textarea",
      localized: true
    },
    {
      name: "image",
      label: "Pilt",
      type: "upload",
      relationTo: "media"
    },
    {
      name: "visible",
      label: "Nähtav",
      type: "checkbox",
      defaultValue: true
    }
  ]
};
