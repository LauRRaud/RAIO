import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Pilt/fail",
    plural: "Pildid ja failid"
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated
  },
  admin: {
    hidden: true,
    useAsTitle: "alt",
    group: "Sisu"
  },
  upload: {
    staticDir: "public/media",
    mimeTypes: ["image/*", "application/pdf"]
  },
  fields: [
    {
      name: "alt",
      label: "Alt tekst",
      type: "text",
      localized: true,
      required: true
    },
    {
      name: "caption",
      label: "Pildiallkiri",
      type: "text",
      localized: true
    }
  ]
};
