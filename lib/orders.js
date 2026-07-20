import { getLocalizedProducts } from "@/lib/messages";
import { isProductionProduct } from "@/lib/shop";
import { mapTransactionStatus } from "@/lib/maksekeskus";

const ORDER_PREFIX = "RAIO";

/**
 * Ehitab ostukorvi read serveripoolsest hinnakirjast. Brauserist tulevat hinda
 * EI usaldata — kliendilt võtame ainult slugi ja koguse.
 */
export function resolveCartItems(locale, rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { items: [], total: 0, error: "empty" };
  }

  const catalog = new Map(getLocalizedProducts(locale).map((product) => [product.slug, product]));
  const items = [];

  for (const raw of rawItems) {
    const product = catalog.get(raw?.slug);
    const quantity = Math.floor(Number(raw?.quantity));

    if (!product || !product.visible) {
      return { items: [], total: 0, error: "unknown_product" };
    }

    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return { items: [], total: 0, error: "invalid_quantity" };
    }

    items.push({
      slug: product.slug,
      name: product.name,
      quantity,
      unitPrice: product.price,
      lineTotal: product.price * quantity,
      productionNote: isProductionProduct(product.status) ? product.estimatedProductionTime || "" : ""
    });
  }

  const total = Math.round(items.reduce((sum, item) => sum + item.lineTotal, 0) * 100) / 100;

  if (total <= 0) {
    return { items: [], total: 0, error: "empty" };
  }

  return { items, total, error: null };
}

/**
 * Järgmine vaba tellimusenumber kujul RAIO-2026-001.
 * orderNumber on unique — samaaegsel tellimusel proovime uuesti.
 */
export async function generateOrderNumber(payload) {
  const year = new Date().getFullYear();
  const prefix = `${ORDER_PREFIX}-${year}-`;

  const existing = await payload.find({
    collection: "orders",
    where: { orderNumber: { like: prefix } },
    sort: "-orderNumber",
    limit: 1,
    depth: 0,
    overrideAccess: true
  });

  const last = existing.docs[0]?.orderNumber;
  const lastSequence = last ? Number.parseInt(last.slice(prefix.length), 10) : 0;
  const next = Number.isFinite(lastSequence) ? lastSequence + 1 : 1;

  return `${prefix}${String(next).padStart(3, "0")}`;
}

/** Leiab tellimuse Maksekeskuse teavituse põhjal (merchant_data = tellimuse id). */
export async function findOrderForNotification(payload, notification) {
  const byId = Number.parseInt(notification?.merchant_data, 10);

  if (Number.isFinite(byId)) {
    try {
      const order = await payload.findByID({
        collection: "orders",
        id: byId,
        depth: 0,
        overrideAccess: true
      });
      if (order) return order;
    } catch {
      // Kirjet pole — proovi allpool reference'i järgi.
    }
  }

  const reference = notification?.reference;

  if (reference) {
    const found = await payload.find({
      collection: "orders",
      where: { orderNumber: { equals: reference } },
      limit: 1,
      depth: 0,
      overrideAccess: true
    });
    if (found.docs[0]) return found.docs[0];
  }

  const transaction = notification?.transaction;

  if (transaction) {
    const found = await payload.find({
      collection: "orders",
      where: { maksekeskusTransactionId: { equals: transaction } },
      limit: 1,
      depth: 0,
      overrideAccess: true
    });
    if (found.docs[0]) return found.docs[0];
  }

  return null;
}

/**
 * Kirjutab Maksekeskuse staatuse tellimusele. Idempotentne: sama teavitust
 * võib tulla mitu korda ja juba tasutud tellimust me tagasi ootele ei vii.
 */
export async function applyTransactionStatus(payload, order, notification) {
  const status = notification?.status;
  const mapped = mapTransactionStatus(status);

  if (order.maksekeskusStatus === status && order.paymentStatus === mapped.paymentStatus) {
    return order;
  }

  // Juba laekunud makset ei tühista hilisem PENDING/CANCELLED teavitus.
  if (order.paymentStatus === "paid" && mapped.paymentStatus !== "refunded") {
    if (order.maksekeskusStatus === status) return order;

    return payload.update({
      collection: "orders",
      id: order.id,
      data: { maksekeskusStatus: status || null },
      overrideAccess: true
    });
  }

  const data = {
    maksekeskusStatus: status || null,
    paymentStatus: mapped.paymentStatus
  };

  if (notification?.transaction) {
    data.maksekeskusTransactionId = notification.transaction;
  }

  if (notification?.method || notification?.channel) {
    data.paymentMethod = notification.method || notification.channel;
  }

  if (mapped.paymentStatus === "paid") {
    data.paidAt = new Date().toISOString();
    data.paidAmount = Number(notification?.amount) || order.orderTotal || null;
  }

  if (mapped.orderStatus && order.status === "new") {
    data.status = mapped.orderStatus;
  }

  return payload.update({
    collection: "orders",
    id: order.id,
    data,
    overrideAccess: true
  });
}
