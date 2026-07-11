import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

export const Events: CollectionConfig = {
  slug: "events",
  labels: {
    singular: "Sündmusekaart",
    plural: "Sündmusekaardid"
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "eventType", "registrationStatus", "visible"],
    group: "02 · KAARDID JA POOD",
    description: "Treeningud, töötoad ja kogukonna sündmused, mida saab avalikul lehel kuvada."
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
      name: "eventType",
      label: "Tüüp",
      type: "select",
      defaultValue: "training",
      options: [
        { label: "Treening", value: "training" },
        { label: "Töötuba", value: "workshop" },
        { label: "Rituaal / kogemus", value: "experience" },
        { label: "Erasündmus", value: "private" }
      ]
    },
    {
      name: "registrationStatus",
      label: "Registreerimine",
      type: "select",
      defaultValue: "open",
      options: [
        { label: "Avatud", value: "open" },
        { label: "Peagi avaneb", value: "soon" },
        { label: "Täis", value: "full" },
        { label: "Suletud", value: "closed" }
      ]
    },
    {
      name: "capacity",
      label: "Kohtade arv",
      type: "number",
      min: 0
    },
    {
      name: "location",
      label: "Asukoht",
      type: "text",
      localized: true
    },
    {
      name: "description",
      label: "Luhikirjeldus",
      type: "textarea",
      localized: true
    },
    {
      name: "content",
      label: "Modali detailne sisu",
      type: "richText",
      localized: true,
      admin: {
        description: "See tekst kuvatakse siis, kui kasutaja avab sundmuse kaardi modaali."
      }
    },
    {
      name: "image",
      label: "Pilt",
      type: "upload",
      relationTo: "media"
    },
    {
      name: "imagePosition",
      label: "Pildi fookus",
      type: "text",
      defaultValue: "center center",
      admin: {
        description: "Naiteks: center 48%, center top voi 60% center."
      }
    },
    {
      name: "ctaUrl",
      label: "Registreerimise link",
      type: "text",
      admin: {
        description: "Lisa väline vorm või kontaktlink, kui sündmus vajab eraldi registreerimist."
      }
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
