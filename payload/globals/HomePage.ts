import type { GlobalConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Avaleht",
  access: {
    read: anyone,
    update: authenticated
  },
  admin: {
    group: "Sisu"
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "heroTitle",
              label: "Hero pealkiri",
              type: "text",
              localized: true
            },
            {
              name: "heroCopy",
              label: "Hero tekst",
              type: "textarea",
              localized: true
            },
            {
              name: "heroImage",
              label: "Hero pilt",
              type: "upload",
              relationTo: "media"
            }
          ]
        },
        {
          label: "Slogan",
          fields: [
            {
              name: "philosophyHeading",
              label: "Pealkiri",
              type: "text",
              localized: true
            },
            {
              name: "philosophyBody",
              label: "Tekst",
              type: "textarea",
              localized: true
            },
            {
              name: "philosophyImage",
              label: "Pilt",
              type: "upload",
              relationTo: "media"
            }
          ]
        },
        {
          label: "Kaardid",
          fields: [
            {
              name: "cards",
              label: "Avalehe kaardid",
              type: "array",
              localized: true,
              fields: [
                {
                  name: "title",
                  label: "Pealkiri",
                  type: "text",
                  required: true
                },
                {
                  name: "path",
                  label: "Link",
                  type: "text",
                  required: true
                },
                {
                  name: "image",
                  label: "Pilt",
                  type: "upload",
                  relationTo: "media"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
