import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

export const ToolCards: CollectionConfig = {
  slug: "tool-cards",
  labels: { singular: "Vahendi kaart", plural: "Vahendite kaardid" },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "sortOrder", "visible"],
    group: "02 · KAARDID JA POOD",
    description: "Vahendite lehe keritava karusselli kaardid. Lisa uus kaart, pilt ja tekst või muuda nende järjekorda."
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", label: "Kaardi pealkiri", type: "text", localized: true, required: true, admin: { width: "70%" } },
        { name: "visible", label: "Nähtav", type: "checkbox", defaultValue: true, admin: { width: "30%" } }
      ]
    },
    { name: "description", label: "Kaardi tekst", type: "textarea", localized: true, required: true },
    { name: "image", label: "Kaardi pilt", type: "upload", relationTo: "media", required: true },
    {
      type: "row",
      fields: [
        {
          name: "category",
          label: "Poe kategooria",
          type: "select",
          required: true,
          options: [
            { label: "Sangpommid", value: "sangpommid" },
            { label: "Hantlid", value: "hantlid" },
            { label: "Puidust vahendid", value: "puidust-vahendid" },
            { label: "Lastele", value: "lastele" }
          ],
          admin: { width: "70%", description: "Route luuakse automaatselt; seda ei saa kogemata katki teha." }
        },
        { name: "sortOrder", label: "Järjekord", type: "number", defaultValue: 100, admin: { width: "30%" } }
      ]
    }
  ]
};
