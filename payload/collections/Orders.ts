import type { CollectionConfig } from "payload";

import { authenticated } from "@/payload/access";

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: {
    singular: "Tellimus",
    plural: "Tellimused"
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated
  },
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: ["orderNumber", "customerName", "status", "orderTotal", "createdAt"],
    group: "Pood",
    description: "Poe eeltellimused, päringud ja käsitsi sisestatavad tellimused."
  },
  fields: [
    {
      name: "orderNumber",
      label: "Tellimuse nr",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Näiteks RAIO-2026-001. Kasuta ühtset järjekorda, et tellimusi oleks lihtne leida."
      }
    },
    {
      name: "status",
      label: "Staatus",
      type: "select",
      defaultValue: "new",
      required: true,
      options: [
        { label: "Uus", value: "new" },
        { label: "Kliendiga ühendust võetud", value: "contacted" },
        { label: "Tootmises", value: "in_production" },
        { label: "Valmis üleandmiseks", value: "ready" },
        { label: "Lõpetatud", value: "completed" },
        { label: "Tühistatud", value: "cancelled" }
      ]
    },
    {
      name: "source",
      label: "Allikas",
      type: "select",
      defaultValue: "website",
      options: [
        { label: "Veebileht", value: "website" },
        { label: "Instagram", value: "instagram" },
        { label: "E-post", value: "email" },
        { label: "Telefon / vestlus", value: "direct" },
        { label: "Muu", value: "other" }
      ]
    },
    {
      type: "collapsible",
      label: "Klient",
      fields: [
        {
          name: "customerName",
          label: "Nimi",
          type: "text",
          required: true
        },
        {
          name: "customerEmail",
          label: "E-post",
          type: "email"
        },
        {
          name: "customerPhone",
          label: "Telefon",
          type: "text"
        },
        {
          name: "deliveryPreference",
          label: "Üleandmine / tarne",
          type: "textarea",
          admin: {
            description: "Kokkulepitud üleandmise koht, tarneviis või muu kliendi soov."
          }
        }
      ]
    },
    {
      type: "collapsible",
      label: "Tellimuse read",
      fields: [
        {
          name: "items",
          label: "Tooted",
          type: "array",
          minRows: 1,
          admin: {
            initCollapsed: true
          },
          fields: [
            {
              name: "product",
              label: "Seotud toode",
              type: "relationship",
              relationTo: "products"
            },
            {
              name: "customName",
              label: "Nimetus / erisoov",
              type: "text",
              admin: {
                description: "Kasuta siis, kui tellimus on eritöö või toodet pole veel poes."
              }
            },
            {
              name: "quantity",
              label: "Kogus",
              type: "number",
              defaultValue: 1,
              min: 1,
              required: true
            },
            {
              name: "unitPrice",
              label: "Tükihind",
              type: "number",
              min: 0
            },
            {
              name: "productionNote",
              label: "Tootmise märkus",
              type: "text"
            }
          ]
        },
        {
          name: "orderTotal",
          label: "Kogusumma",
          type: "number",
          min: 0,
          admin: {
            description: "Sisesta kokkulepitud lõppsumma eurodes."
          }
        }
      ]
    },
    {
      type: "collapsible",
      label: "Suhtlus ja märkmed",
      fields: [
        {
          name: "customerMessage",
          label: "Kliendi sõnum",
          type: "textarea"
        },
        {
          name: "internalNotes",
          label: "Sisemärkmed",
          type: "textarea",
          admin: {
            description: "Nähtav ainult adminis. Lisa tootmise, makse või kokkulepete märkmed."
          }
        },
        {
          name: "followUpAt",
          label: "Järeltegevuse kuupäev",
          type: "date",
          admin: {
            description: "Kasulik, kui tellimus vajab hilisemat kinnitamist või kliendiga ühendust."
          }
        }
      ]
    }
  ]
};
