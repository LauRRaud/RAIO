import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "Toode",
    plural: "Tooted"
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price", "status", "featured", "visible"],
    group: "Pood",
    description: "Avaliku poe tooted, hinnad, staatuseinfo ja tootmismärkused."
  },
  fields: [
    {
      name: "name",
      label: "Nimi",
      type: "text",
      localized: true,
      required: true
    },
    {
      name: "slug",
      label: "URL slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Näiteks: kivisangpomm"
      }
    },
    {
      name: "sku",
      label: "Tootekood",
      type: "text",
      unique: true,
      admin: {
        description: "Sisemine tähis tootmise ja tellimuste sidumiseks."
      }
    },
    {
      name: "description",
      label: "Kirjeldus",
      type: "textarea",
      localized: true
    },
    {
      name: "price",
      label: "Hind",
      type: "number",
      required: true,
      min: 0
    },
    {
      name: "category",
      label: "Kategooria",
      type: "select",
      required: true,
      options: [
        { label: "Sangpommid", value: "sangpommid" },
        { label: "Hantlid", value: "hantlid" },
        { label: "Puidust vahendid", value: "puidust-vahendid" },
        { label: "Lastele", value: "lastele" }
      ]
    },
    {
      name: "status",
      label: "Staatus",
      type: "select",
      defaultValue: "PREORDER",
      required: true,
      options: [
        { label: "Saadaval", value: "AVAILABLE" },
        { label: "Valmib tellimuse alusel", value: "MADE_TO_ORDER" },
        { label: "Ette tellitav", value: "PREORDER" },
        { label: "Ajutiselt mitte saadaval", value: "TEMPORARILY_UNAVAILABLE" }
      ]
    },
    {
      name: "images",
      label: "Pildid",
      type: "upload",
      relationTo: "media",
      hasMany: true
    },
    {
      name: "featured",
      label: "Esile tõstetud",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Kasuta, kui toodet peaks poes või avalehel eelistatult näitama."
      }
    },
    {
      name: "sortOrder",
      label: "Järjekord",
      type: "number",
      defaultValue: 100,
      admin: {
        description: "Väiksem number tuleb nimekirjas ettepoole."
      }
    },
    {
      name: "estimatedProductionTime",
      label: "Valmimisaeg",
      type: "text",
      localized: true
    },
    {
      name: "productionNote",
      label: "Tootmise märkus",
      type: "text",
      localized: true
    },
    {
      name: "visible",
      label: "Nähtav poes",
      type: "checkbox",
      defaultValue: true
    }
  ]
};
