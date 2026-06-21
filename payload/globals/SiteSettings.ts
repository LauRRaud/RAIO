import type { GlobalConfig } from "payload";

import { anyone, authenticated } from "@/payload/access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Üldseaded",
  access: {
    read: anyone,
    update: authenticated
  },
  admin: {
    group: "Seaded"
  },
  fields: [
    {
      name: "brandName",
      label: "Brändi nimi",
      type: "text",
      localized: true,
      defaultValue: "RA•IO"
    },
    {
      name: "companyName",
      label: "Ärinimi",
      type: "text",
      defaultValue: "Raio33Movement OÜ"
    },
    {
      name: "registryCode",
      label: "Registrikood",
      type: "text",
      defaultValue: "17338447"
    },
    {
      name: "footerSlogan",
      label: "Footeri slogan",
      type: "text",
      localized: true
    },
    {
      name: "email",
      label: "E-post",
      type: "email"
    },
    {
      name: "instagramUrl",
      label: "Instagrami link",
      type: "text"
    }
  ]
};
