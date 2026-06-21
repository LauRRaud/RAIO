import type { Field } from "payload";

export const heroFields: Field[] = [
  {
    name: "heroTitle",
    label: "Hero pealkiri",
    type: "text",
    localized: true
  },
  {
    name: "heroText",
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
];
