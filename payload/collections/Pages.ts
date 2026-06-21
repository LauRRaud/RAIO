import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";
import { heroFields } from "@/payload/fields";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "Leht",
    plural: "Lehed"
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug"],
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
      name: "slug",
      label: "Lehe tunnus",
      type: "select",
      required: true,
      unique: true,
      options: [
        { label: "Treeningud", value: "treeningud" },
        { label: "Vahendid", value: "vahendid" },
        { label: "Sündmused", value: "sundmused" },
        { label: "Pood", value: "pood" },
        { label: "Meist", value: "meist" },
        { label: "Journal", value: "journal" },
        { label: "Ostukorv", value: "ostukorv" },
        { label: "Kontakt", value: "kontakt" }
      ]
    },
    ...heroFields,
    {
      name: "intro",
      label: "Sissejuhatus",
      type: "textarea",
      localized: true
    },
    {
      name: "content",
      label: "Sisu",
      type: "richText",
      localized: true
    },
    {
      name: "seoTitle",
      label: "SEO pealkiri",
      type: "text",
      localized: true
    },
    {
      name: "seoDescription",
      label: "SEO kirjeldus",
      type: "textarea",
      localized: true
    }
  ]
};
