export const productStatusLabels = {
  AVAILABLE: "Saadaval",
  MADE_TO_ORDER: "Valmib tellimuse alusel",
  PREORDER: "Ette tellitav",
  TEMPORARILY_UNAVAILABLE: "Ajutiselt mitte saadaval"
};

export const productActionLabels = {
  AVAILABLE: "Lisa ostukorvi",
  MADE_TO_ORDER: "Telli valmistamiseks",
  PREORDER: "Telli ette",
  TEMPORARILY_UNAVAILABLE: "Ei ole hetkel saadaval"
};

export const shopCategories = [
  { id: "all", label: "Kõik" },
  { id: "sangpommid", label: "Sangpommid" },
  { id: "hantlid", label: "Hantlid" },
  { id: "puidust-vahendid", label: "Puidust vahendid" },
  { id: "lastele", label: "Lastele" }
];

export const shopProducts = [
  {
    name: "Treeningnui (sau)",
    slug: "treeningnui-sau",
    description:
      "Puidust treeningvahend liikuvuse, haarde ja kogu keha jõu arendamiseks.",
    price: 80,
    images: [
      "/Pictures/Pood/jalutuskepp.png",
      "/Pictures/Pood/oma materjal.png",
      "/Pictures/Pood/header pood.png"
    ],
    status: "PREORDER",
    preorderEnabled: true,
    estimatedProductionTime: "2–4 nädalat",
    productionNote: "Valmib käsitööna tellimuse alusel.",
    stockQuantity: undefined,
    visible: true,
    category: "puidust-vahendid",
    categoryLabel: "Puidust vahendid"
  },
  {
    name: "Kivisangpomm",
    slug: "kivisangpomm",
    description:
      "Kivist sangpomm jõu, vastupidavuse ja keha kontrolli treeninguks.",
    price: 128,
    images: [
      "/Pictures/Pood/kivi sangpomm.jpg",
      "/Pictures/Pood/Puu ja kivi sangpomm.png",
      "/Pictures/Pood/header pood.png"
    ],
    status: "PREORDER",
    preorderEnabled: true,
    estimatedProductionTime: "2–4 nädalat",
    productionNote: "Iga kivi vorm ja tekstuur on ainulaadne.",
    stockQuantity: undefined,
    visible: true,
    category: "sangpommid",
    categoryLabel: "Sangpommid"
  },
  {
    name: "Puu & kivi sangpomm",
    slug: "puu-kivi-sangpomm",
    description:
      "Puidust käepidemega kivisangpomm loomulikuks ja mitmekesiseks treeninguks.",
    price: 80,
    images: [
      "/Pictures/Pood/Puu ja kivi sangpomm.png",
      "/Pictures/Pood/header pood.png",
      "/Pictures/Pood/kivi sangpomm.jpg"
    ],
    status: "PREORDER",
    preorderEnabled: true,
    estimatedProductionTime: "2–4 nädalat",
    productionNote: "Valmib puidu ja kivi loomulikku kuju arvestades.",
    stockQuantity: undefined,
    visible: true,
    category: "sangpommid",
    categoryLabel: "Sangpommid"
  },
  {
    name: "Hantlid",
    slug: "hantlid",
    description:
      "Kivist raskused puidust käepidemega rahulikuks jõu- ja vastupidavustreeninguks.",
    price: 44,
    images: [
      "/Pictures/Pood/hantlid.png",
      "/Pictures/Pood/header pood.png",
      "/Pictures/Pood/oma materjal.png"
    ],
    status: "PREORDER",
    preorderEnabled: true,
    estimatedProductionTime: "2–4 nädalat",
    productionNote: "Komplekti kaal täpsustatakse tellimisel.",
    stockQuantity: undefined,
    visible: true,
    category: "hantlid",
    categoryLabel: "Hantlid"
  },
  {
    name: "Laste treeningvahendid",
    slug: "laste-treeningvahendid",
    description:
      "Lastele loodud kergemad looduslikud vahendid mänguliseks liikumiseks.",
    price: 33,
    images: [
      "/Pictures/Pood/laste treeningvahendid.png",
      "/Pictures/Pood/header pood.png",
      "/Pictures/Pood/Puu ja kivi sangpomm.png"
    ],
    status: "PREORDER",
    preorderEnabled: true,
    estimatedProductionTime: "2–4 nädalat",
    productionNote: "Suurus ja kaal kohandatakse lapse vanusele.",
    stockQuantity: undefined,
    visible: true,
    category: "lastele",
    categoryLabel: "Lastele"
  }
];

export function getProductBySlug(slug) {
  return shopProducts.find((product) => product.slug === slug);
}

export function getProductStatusLabel(status) {
  return productStatusLabels[status] || "Saadaval";
}

export function getProductActionLabel(status) {
  return productActionLabels[status] || "Lisa ostukorvi";
}

export function isProductionProduct(status) {
  return status === "MADE_TO_ORDER" || status === "PREORDER";
}

export function getProductionWarning(product) {
  if (!isProductionProduct(product.status)) return "";

  return `See toode valmib käsitööna tellimuse alusel. Eeldatav valmimisaeg on ${product.estimatedProductionTime}. Täpsem tarneaeg kinnitatakse pärast tellimuse esitamist.`;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("et-EE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2
  }).format(value);
}

export function createCheckoutMailto(
  items,
  recipientEmail = "ra.io33movement@gmail.com",
  locale = "et",
  labels = {}
) {
  const isEnglish = locale === "en";
  const lines = [isEnglish ? "RAIO cart" : "RAIO ostukorv", ""];

  for (const item of items) {
    lines.push(`${item.quantity} x ${item.name} - ${formatCurrency(item.price * item.quantity)}`);

    if (isProductionProduct(item.status)) {
      const fallbackWarning = isEnglish
        ? "This product is handmade to order. Estimated production time is {time}. A more exact delivery time is confirmed after the order is placed."
        : "See toode valmib käsitööna tellimuse alusel. Eeldatav valmimisaeg on {time}. Täpsem tarneaeg kinnitatakse pärast tellimuse esitamist.";
      const warning = (labels.productionWarning || fallbackWarning).replace("{time}", item.estimatedProductionTime);
      lines.push(`${isEnglish ? "Note" : "Hoiatus"}: ${warning}`);
    }

    lines.push("");
  }

  const body = lines.join("\n").trim();
  const subject = isEnglish ? "RAIO order" : "RAIO tellimus";
  return `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
