import config from "@payload-config";
import { getPayload } from "payload";
import { getLocalizedProducts, getMessages } from "@/lib/messages";

const journalCategoryLabels = {
  et: {
    treening: "Treening",
    loodus: "Loodus",
    kasitoo: "Kasitoo",
    motted: "Motted"
  },
  en: {
    treening: "Training",
    loodus: "Nature",
    kasitoo: "Craft",
    motted: "Thoughts"
  }
};

const pageImageOverrides = [
  ["homeHeroImage", ["home", "hero", "image"]],
  ["homePhilosophyImage", ["home", "philosophy", "image"]],
  ["homeTrainingCardImage", ["home", "categoryWorld", "cards", 0, "image"]],
  ["homeToolsCardImage", ["home", "categoryWorld", "cards", 1, "image"]],
  ["homeEventsCardImage", ["home", "categoryWorld", "cards", 2, "image"]],
  ["homeAboutCardImage", ["home", "categoryWorld", "cards", 3, "image"]],
  ["homeJournalCardImage", ["home", "categoryWorld", "cards", 4, "image"]],
  ["trainingHeroImage", ["training", "heroImage"]],
  ["trainingFunctionalImage", ["training", "trainings", 0, "image"]],
  ["trainingNatureImage", ["training", "trainings", 1, "image"]],
  ["trainingStayingImage", ["training", "trainings", 2, "image"]],
  ["trainingPrivateImage", ["training", "trainings", 3, "image"]],
  ["trainingLastingImage", ["training", "lasting", "image"]],
  ["toolsHeroImage", ["tools", "heroImage"]],
  ["toolsStickImage", ["tools", "categories", 0, "image"]],
  ["toolsKettlebellImage", ["tools", "categories", 1, "image"]],
  ["toolsDumbbellImage", ["tools", "categories", 2, "image"]],
  ["toolsKidsImage", ["tools", "categories", 3, "image"]],
  ["toolsStoneWoodImage", ["tools", "categories", 4, "image"]],
  ["toolsMaterialImage", ["tools", "material", "image"]],
  ["toolsCareImage", ["tools", "care", "image"]],
  ["toolsCustomImage", ["tools", "custom", "image"]],
  ["eventsHeroImage", ["events", "heroImage"]],
  ["eventsTrainingImage", ["events", "events", 0, "image"]],
  ["eventsWorkshopImage", ["events", "events", 1, "image"]],
  ["eventsRetreatImage", ["events", "events", 2, "image"]],
  ["eventsRitualImage", ["events", "events", 3, "image"]],
  ["eventsHostImage", ["events", "host", "image"]],
  ["shopHeroImage", ["shop", "heroImage"]],
  ["aboutHeroImage", ["about", "heroImage"]],
  ["aboutStoryImage", ["about", "storyImage"]],
  ["aboutTrainerImage", ["about", "trainers", 0, "image"]],
  ["journalHeroImage", ["journal", "heroImage"]],
  ["journalSignupImage", ["journal", "signupImage"]]
];

function getUploadUrl(upload, fallback = "") {
  if (!upload || typeof upload !== "object") return fallback;
  return upload.url || fallback;
}

function lines(value, fallback) {
  if (!value) return fallback;
  return String(value).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function applyText(target, key, value) {
  if (value !== undefined && value !== null && value !== "") target[key] = value;
}

function applyImage(target, key, value) {
  const url = getUploadUrl(value);
  if (url) target[key] = url;
}

function recordStyle(messages, key, group) {
  if (!group) return;
  messages.cmsStyles ||= {};
  messages.cmsStyles[key] = {
    backgroundColor: group.styleBackgroundColor || "",
    textColor: group.styleTextColor || "",
    headingFont: group.styleHeadingFont || "inherit",
    bodyFont: group.styleBodyFont || "inherit"
  };
}

function applyHero(messages, key, target, group, home = false) {
  if (!group) return;
  if (home) {
    applyText(target, "titleStart", group.title);
    applyText(target, "titleAccent", group.accent);
    applyText(target, "copy", group.text);
    applyText(target, "eyebrow", group.eyebrow);
  } else {
    applyText(target, "heroTitle", group.title);
    if (group.text) target.heroText = lines(group.text, target.heroText);
    applyImage(target, "heroImage", group.image);
    applyImage(target, "heroImageMobile", group.mobileImage);
  }
  if (home) applyImage(target, "image", group.image);
  recordStyle(messages, key, group);
}

function applySection(messages, key, target, group, mapping = {}) {
  if (!group || !target) return;
  for (const [source, destination] of Object.entries(mapping)) {
    if (source === "image") applyImage(target, destination, group[source]);
    else if (source === "textLines" && group.text) target[destination] = lines(group.text, target[destination]);
    else applyText(target, destination, group[source]);
  }
  recordStyle(messages, key, group);
}

function applyPageEditor(messages, editor) {
  if (!editor) return;

  const navLabels = {
    treeningud: editor.navigation?.trainings,
    vahendid: editor.navigation?.tools,
    sundmused: editor.navigation?.events,
    pood: editor.navigation?.shop,
    meist: editor.navigation?.about,
    journal: editor.navigation?.journal
  };
  messages.header.primaryNav = messages.header.primaryNav.map((item) => ({
    ...item,
    label: navLabels[item.key] || item.label
  }));

  applyText(messages.footer, "slogan", editor.footer?.slogan);
  applyText(messages.footer, "instagramLabel", editor.footer?.instagramLabel);
  if (editor.footer?.instagramUrl) messages.footer.instagramUrl = editor.footer.instagramUrl;
  recordStyle(messages, "footer", editor.footer);

  applyHero(messages, "homeHero", messages.home.hero, editor.homeHero, true);
  applySection(messages, "homePhilosophy", messages.home.philosophy, editor.homePhilosophy, { eyebrow: "eyebrow", title: "headingStart", accent: "headingAccent", text: "body", image: "image" });
  applySection(messages, "homeTools", messages.home.tools, editor.homeTools, { eyebrow: "eyebrow", title: "headingStart", accent: "headingAccent", text: "copy", image: "image" });
  if (Array.isArray(editor.homeCards) && editor.homeCards.length) {
    messages.home.categoryWorld.cards = editor.homeCards.map((card, index) => ({
      key: `${card.route || "card"}-${index}`,
      title: card.title || "",
      subtitle: card.subtitle || "",
      path: card.route,
      image: getUploadUrl(card.image, messages.home.categoryWorld.cards[index]?.image || "/Pictures/Avaleht/RAIO VAHENDID.png"),
      alt: card.title || "RA•IO"
    }));
  }
  recordStyle(messages, "homeCards", editor.homeCardsStyle);

  for (const [page, group] of [["training", editor.trainingHero], ["tools", editor.toolsHero], ["events", editor.eventsHero], ["shop", editor.shopHero], ["about", editor.aboutHero], ["journal", editor.journalHero]]) {
    applyHero(messages, `${page}Hero`, messages[page], group);
    if (page === "shop" && group?.text) messages.shop.heroText = group.text;
  }
  applyText(messages.shop, "heroNote", editor.shopHero?.accent);
  applyText(messages.shop, "kicker", editor.shopHero?.eyebrow);

  applySection(messages, "trainingCarousel", messages.training, editor.trainingCarousel, { title: "listTitle", cta: "cardCta" });
  if (Array.isArray(editor.trainingCarousel?.qualities) && editor.trainingCarousel.qualities.length) {
    messages.training.qualities = editor.trainingCarousel.qualities.map((item, index) => ({
      title: item.title,
      icon: messages.training.qualities[index]?.icon || "leaf"
    }));
  }
  applySection(messages, "trainingLasting", messages.training.lasting, editor.trainingLasting, { title: "title", text: "text", cta: "cta", image: "image" });
  applySection(messages, "trainingWorkshop", messages.training.workshop, editor.trainingWorkshop, { title: "title", text: "text", cta: "cta" });
  applySection(messages, "toolsCarousel", messages.tools, editor.toolsCarousel, { title: "categoriesTitle", cta: "categoryCta" });
  if (Array.isArray(editor.toolsCarousel?.proofLabels) && editor.toolsCarousel.proofLabels.length) {
    messages.tools.heroProof = editor.toolsCarousel.proofLabels.map((item, index) => ({
      label: item.label,
      icon: messages.tools.heroProof[index]?.icon || "leaf"
    }));
  }
  applySection(messages, "toolsMaterial", messages.tools.material, editor.toolsMaterial, { title: "title", text: "text", image: "image" });
  applySection(messages, "toolsCare", messages.tools.care, editor.toolsCare, { title: "title", textLines: "lines", image: "image" });
  applySection(messages, "eventsCarousel", messages.events, editor.eventsCarousel, { title: "upcomingTitle", cta: "cardCta" });
  applySection(messages, "eventsHost", messages.events.host, editor.eventsHost, { title: "title", text: "text", cta: "cta", image: "image" });
  applySection(messages, "shopProducts", messages.shop, editor.shopProducts, { title: "productsTitle" });
  applySection(messages, "shopCustom", messages.tools.custom, editor.shopCustom, { title: "title", textLines: "lines", cta: "cta", image: "image" });
  applySection(messages, "aboutStory", messages.about, editor.aboutStory, { title: "storyTitle", textLines: "story", image: "storyImage" });
  applySection(messages, "aboutTrainers", messages.about, editor.aboutTrainers, { title: "trainersTitle" });
  if (Array.isArray(editor.aboutTrainers?.items) && editor.aboutTrainers.items.length) {
    messages.about.trainers = editor.aboutTrainers.items.map((trainer, index) => ({
      name: trainer.name || "",
      text: trainer.text || "",
      image: getUploadUrl(trainer.image, messages.about.trainers[index]?.image || "/Pictures/Meist/treener.jpg"),
      imageAlt: trainer.name || "RA•IO treener"
    }));
  }
  applySection(messages, "aboutClosing", messages.about, editor.aboutClosing, { title: "closingTitle" });
  if (Array.isArray(editor.aboutClosing?.values) && editor.aboutClosing.values.length) {
    messages.about.values = editor.aboutClosing.values.map((value) => ({ title: value.title || "", text: value.text || "" }));
  }
  applyText(messages.about.contactPanel, "title", editor.aboutClosing?.contactTitle);
  applyText(messages.about.contactPanel, "instagram", editor.aboutClosing?.instagramLabel);
  applySection(messages, "journalCarousel", messages.journal, editor.journalCarousel, { title: "storiesTitle", cta: "readMore" });
  applySection(messages, "journalSignup", messages.journal.signup, editor.journalSignup, { title: "title", text: "text", cta: "cta" });
  applyImage(messages.journal, "signupImage", editor.journalSignup?.image);
  recordStyle(messages, "journalSignup", editor.journalSignup);
}

export function getCmsSectionProps(messages, key) {
  const style = messages?.cmsStyles?.[key];
  if (!style) return { "data-cms-section": key };
  const fontMap = {
    posterama: '"Posterama", Arial, sans-serif',
    sans: 'Arial, Helvetica, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    mono: '"Courier New", monospace'
  };
  return {
    "data-cms-section": key,
    style: {
      ...(style.backgroundColor ? { backgroundColor: style.backgroundColor } : {}),
      ...(style.textColor ? { color: style.textColor, "--cms-color": style.textColor } : {}),
      ...(fontMap[style.headingFont] ? { "--cms-heading-font": fontMap[style.headingFont] } : {}),
      ...(fontMap[style.bodyFont] ? { "--cms-body-font": fontMap[style.bodyFont] } : {})
    }
  };
}

async function getPayloadClient() {
  return getPayload({ config });
}

function setNestedValue(target, path, value) {
  let cursor = target;

  for (const key of path.slice(0, -1)) {
    if (cursor?.[key] === undefined) return;
    cursor = cursor[key];
  }

  const lastKey = path[path.length - 1];
  if (cursor && lastKey in cursor) {
    cursor[lastKey] = value;
  }
}

function richTextToParagraphs(content) {
  const rootChildren = content?.root?.children;

  if (!Array.isArray(rootChildren)) return [];

  return rootChildren
    .map((node) => {
      if (!Array.isArray(node.children)) return "";

      return node.children
        .map((child) => child.text || "")
        .join("")
        .trim();
    })
    .filter(Boolean);
}

function formatDate(date, locale) {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

function getCategoryLabel(messages, category) {
  return messages.shop.categories.find((item) => item.id === category)?.label || category;
}

function productToViewModel(product, locale, messages) {
  const fallback = getLocalizedProducts(locale).find((item) => item.slug === product.slug);
  const images = Array.isArray(product.images)
    ? product.images.map((image) => getUploadUrl(image)).filter(Boolean)
    : [];

  return {
    ...(fallback || {}),
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    description: product.description || "",
    price: product.price,
    images: images.length ? images : fallback?.images || ["/Pictures/Pood/header pood.png"],
    status: product.status,
    preorderEnabled: product.status === "PREORDER",
    stockQuantity: undefined,
    visible: product.visible !== false,
    category: product.category,
    categoryLabel: getCategoryLabel(messages, product.category),
    estimatedProductionTime: product.estimatedProductionTime || fallback?.estimatedProductionTime || "",
    productionNote: product.productionNote || fallback?.productionNote || "",
    featured: product.featured,
    sortOrder: product.sortOrder ?? 100
  };
}

function trainingToViewModel(training, fallback) {
  const body = richTextToParagraphs(training.content);

  return {
    ...(fallback || {}),
    title: training.title,
    description: training.description || "",
    duration: training.duration || fallback?.duration || "",
    level: training.level || fallback?.level || "",
    image: getUploadUrl(training.image, fallback?.image || "/Pictures/Treeningud/header.png"),
    body: body.length ? body : fallback?.body || [training.description || ""].filter(Boolean),
    sortOrder: training.sortOrder ?? 100
  };
}

function eventToViewModel(event, locale, fallback) {
  const body = richTextToParagraphs(event.content);

  return {
    ...(fallback || {}),
    date: formatDate(event.date, locale) || fallback?.date || "",
    title: event.title,
    description: event.description || "",
    location: event.location || fallback?.location || "",
    image: getUploadUrl(event.image, fallback?.image || "/Pictures/Sündmused/sundmused-header.png"),
    imagePosition: event.imagePosition || fallback?.imagePosition || "center center",
    body: body.length ? body : fallback?.body || [event.description || ""].filter(Boolean),
    sortOrder: event.sortOrder ?? 100
  };
}

function mergeEditableItems(fallbackItems, docs, createItem) {
  const merged = [...fallbackItems];

  docs.forEach((doc, index) => {
    const existingIndex = merged.findIndex((item) => item.title === doc.title);
    const fallback = existingIndex >= 0 ? merged[existingIndex] : fallbackItems[index];
    const item = createItem(doc, fallback);

    if (existingIndex >= 0) {
      merged[existingIndex] = item;
    } else {
      merged.push(item);
    }
  });

  return merged;
}

export async function getMessagesWithAdminImages(locale = "et") {
  const messages = structuredClone(getMessages(locale));

  try {
    const payload = await getPayloadClient();
    const pageImages = await payload.findGlobal({
      slug: "page-images",
      locale,
      fallbackLocale: "et",
      depth: 1
    });

    for (const [fieldName, path] of pageImageOverrides) {
      const uploadUrl = getUploadUrl(pageImages[fieldName]);
      if (uploadUrl) setNestedValue(messages, path, uploadUrl);
    }

    const editor = await payload.findGlobal({
      slug: "page-editor",
      locale,
      fallbackLocale: "et",
      depth: 1
    });
    applyPageEditor(messages, editor);
  } catch (error) {
    console.warn("Payload page images unavailable, using static fallbacks.", error);
  }

  return messages;
}

export async function getToolItems(locale = "et", fallbackItems = []) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "tool-cards",
      locale,
      fallbackLocale: "et",
      depth: 1,
      limit: 100,
      sort: "sortOrder,title",
      where: { visible: { equals: true } }
    });
    if (!result.docs.length) return fallbackItems;
    return result.docs.map((item) => ({
      title: item.title,
      description: item.description || "",
      image: getUploadUrl(item.image, "/Pictures/Vahendid/header.png"),
      href: `/pood?kategooria=${item.category}`
    }));
  } catch (error) {
    console.warn("Payload tool cards unavailable, using static fallback.", error);
    return fallbackItems;
  }
}

export async function getPayloadProducts(locale = "et") {
  const messages = await getMessagesWithAdminImages(locale);

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "products",
      locale,
      fallbackLocale: "et",
      depth: 1,
      limit: 100,
      sort: "sortOrder,name",
      where: {
        visible: {
          equals: true
        }
      }
    });

    if (!result.docs.length) {
      return getLocalizedProducts(locale);
    }

    return result.docs.map((product) => productToViewModel(product, locale, messages));
  } catch (error) {
    console.warn("Payload products unavailable, using static fallback.", error);
    return getLocalizedProducts(locale);
  }
}

export async function getPayloadProduct(locale = "et", slug) {
  const products = await getPayloadProducts(locale);
  return products.find((product) => product.slug === slug);
}

export async function getTrainingItems(locale = "et", fallbackTrainings = []) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "trainings",
      locale,
      fallbackLocale: "et",
      depth: 1,
      limit: 100,
      sort: "sortOrder,title",
      where: {
        visible: {
          equals: true
        }
      }
    });

    if (!result.docs.length) {
      return fallbackTrainings;
    }

    return mergeEditableItems(fallbackTrainings, result.docs, (training, fallback) =>
      trainingToViewModel(training, fallback)
    );
  } catch (error) {
    console.warn("Payload trainings unavailable, using static fallback.", error);
    return fallbackTrainings;
  }
}

export async function getEventItems(locale = "et", fallbackEvents = []) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "events",
      locale,
      fallbackLocale: "et",
      depth: 1,
      limit: 100,
      sort: "sortOrder,date",
      where: {
        visible: {
          equals: true
        }
      }
    });

    if (!result.docs.length) {
      return fallbackEvents;
    }

    return mergeEditableItems(fallbackEvents, result.docs, (event, fallback) =>
      eventToViewModel(event, locale, fallback)
    );
  } catch (error) {
    console.warn("Payload events unavailable, using static fallback.", error);
    return fallbackEvents;
  }
}

export async function getJournalArticles(locale = "et", fallbackArticles = []) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "journal-articles",
      locale,
      fallbackLocale: "et",
      depth: 1,
      limit: 100,
      sort: "sortOrder,-publishedAt",
      where: {
        visible: {
          equals: true
        }
      }
    });

    if (!result.docs.length) {
      return fallbackArticles;
    }

    return result.docs.map((article) => {
      const body = richTextToParagraphs(article.content);
      const image = getUploadUrl(article.image, "/Pictures/Journal/journal.png");

      return {
        date: formatDate(article.publishedAt, locale),
        category: journalCategoryLabels[locale]?.[article.category] || article.category || "",
        title: article.title,
        excerpt: article.excerpt || "",
        image,
        body: body.length ? body : [article.excerpt || ""].filter(Boolean)
      };
    });
  } catch (error) {
    console.warn("Payload journal articles unavailable, using static fallback.", error);
    return fallbackArticles;
  }
}
