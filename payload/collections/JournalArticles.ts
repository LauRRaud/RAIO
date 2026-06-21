import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

export const JournalArticles: CollectionConfig = {
  slug: "journal-articles",
  labels: {
    singular: "Journal artikkel",
    plural: "Journal artiklid"
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "featured", "visible"],
    group: "Journal",
    description: "Journal artiklid, kaanepildid, avaldamise ajad ja esiletõstmised."
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
      label: "URL slug",
      type: "text",
      required: true,
      unique: true
    },
    {
      name: "category",
      label: "Kategooria",
      type: "select",
      options: [
        { label: "Treening", value: "treening" },
        { label: "Loodus", value: "loodus" },
        { label: "Käsitöö", value: "kasitoo" },
        { label: "Mõtted", value: "motted" }
      ]
    },
    {
      name: "publishedAt",
      label: "Avaldamise aeg",
      type: "date"
    },
    {
      name: "readingTime",
      label: "Lugemisaeg",
      type: "text",
      localized: true,
      admin: {
        description: "Näiteks: 4 min lugemist"
      }
    },
    {
      name: "excerpt",
      label: "Lühikirjeldus",
      type: "textarea",
      localized: true
    },
    {
      name: "image",
      label: "Kaanepilt",
      type: "upload",
      relationTo: "media"
    },
    {
      name: "content",
      label: "Sisu",
      type: "richText",
      localized: true
    },
    {
      name: "featured",
      label: "Esile tõstetud",
      type: "checkbox",
      defaultValue: false
    },
    {
      name: "sortOrder",
      label: "Järjekord",
      type: "number",
      defaultValue: 100
    },
    {
      name: "visible",
      label: "Nähtav",
      type: "checkbox",
      defaultValue: true
    }
  ]
};
