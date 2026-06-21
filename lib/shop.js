export const shopProducts = [
  {
    slug: "treeningnui-sau",
    price: 80,
    images: [
      "/Pictures/Pood/jalutuskepp.png",
      "/Pictures/Pood/oma materjal.png",
      "/Pictures/Pood/header pood.png"
    ],
    status: "PREORDER",
    preorderEnabled: true,
    stockQuantity: undefined,
    visible: true,
    category: "puidust-vahendid"
  },
  {
    slug: "kivisangpomm",
    price: 128,
    images: [
      "/Pictures/Pood/kivi sangpomm.jpg",
      "/Pictures/Pood/Puu ja kivi sangpomm.png",
      "/Pictures/Pood/header pood.png"
    ],
    status: "PREORDER",
    preorderEnabled: true,
    stockQuantity: undefined,
    visible: true,
    category: "sangpommid"
  },
  {
    slug: "puu-kivi-sangpomm",
    price: 80,
    images: [
      "/Pictures/Pood/Puu ja kivi sangpomm.png",
      "/Pictures/Pood/header pood.png",
      "/Pictures/Pood/kivi sangpomm.jpg"
    ],
    status: "PREORDER",
    preorderEnabled: true,
    stockQuantity: undefined,
    visible: true,
    category: "sangpommid"
  },
  {
    slug: "hantlid",
    price: 44,
    images: [
      "/Pictures/Pood/hantlid.png",
      "/Pictures/Pood/header pood.png",
      "/Pictures/Pood/oma materjal.png"
    ],
    status: "PREORDER",
    preorderEnabled: true,
    stockQuantity: undefined,
    visible: true,
    category: "hantlid"
  },
  {
    slug: "laste-treeningvahendid",
    price: 33,
    images: [
      "/Pictures/Pood/laste treeningvahendid.png",
      "/Pictures/Pood/header pood.png",
      "/Pictures/Pood/Puu ja kivi sangpomm.png"
    ],
    status: "PREORDER",
    preorderEnabled: true,
    stockQuantity: undefined,
    visible: true,
    category: "lastele"
  }
];

export function getProductBySlug(slug) {
  return shopProducts.find((product) => product.slug === slug);
}

export function isProductionProduct(status) {
  return status === "MADE_TO_ORDER" || status === "PREORDER";
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
  recipientEmail,
  labels = {}
) {
  const lines = [labels.emailTitle, ""];

  for (const item of items) {
    lines.push(`${item.quantity} x ${item.name} - ${formatCurrency(item.price * item.quantity)}`);

    if (isProductionProduct(item.status)) {
      const warning = labels.productionWarning.replace("{time}", item.estimatedProductionTime);
      lines.push(`${labels.emailNoteLabel}: ${warning}`);
    }

    lines.push("");
  }

  const body = lines.join("\n").trim();
  return `mailto:${recipientEmail}?subject=${encodeURIComponent(labels.emailSubject)}&body=${encodeURIComponent(body)}`;
}
