import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Kasutaja",
    plural: "Kasutajad"
  },
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Admin"
  },
  fields: []
};
