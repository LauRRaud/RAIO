// @ts-nocheck -- one-off data bridge from static JSON into localized Payload collections
import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import { getPayload } from "payload";

import { shopProducts } from "../lib/shop.js";

const root = process.cwd();
const { loadEnvConfig } = nextEnv;
loadEnvConfig(root);

const { default: config } = await import("../payload.config");
const payload = await getPayload({ config });
const messages = {
  et: JSON.parse(fs.readFileSync(path.join(root, "messages", "et.json"), "utf8")),
  en: JSON.parse(fs.readFileSync(path.join(root, "messages", "en.json"), "utf8"))
};

const mediaCache = new Map<string, number | string>();
const summary: Record<string, number | string> = {};
const force = process.argv.includes("--force");

function publicFile(publicUrl: string) {
  return path.join(root, "public", decodeURI(publicUrl).replace(/^\/+/, ""));
}

function altFromPath(publicUrl: string) {
  return decodeURI(path.basename(publicUrl, path.extname(publicUrl))).replace(/[-_]+/g, " ");
}

async function ensureMedia(publicUrl: string, alt?: string) {
  if (!publicUrl) return undefined;
  if (mediaCache.has(publicUrl)) return mediaCache.get(publicUrl);

  const caption = `RAIO algne pilt: ${publicUrl}`;
  const existing = await payload.find({
    collection: "media",
    locale: "et",
    limit: 1,
    where: { caption: { equals: caption } }
  });

  if (existing.docs[0]) {
    mediaCache.set(publicUrl, existing.docs[0].id);
    return existing.docs[0].id;
  }

  const filePath = publicFile(publicUrl);
  if (!fs.existsSync(filePath)) {
    console.warn(`Pilt puudub, jätan vahele: ${publicUrl}`);
    return undefined;
  }

  const created = await payload.create({
    collection: "media",
    locale: "et",
    overrideAccess: true,
    data: {
      alt: alt || altFromPath(publicUrl),
      caption
    },
    filePath
  });
  mediaCache.set(publicUrl, created.id);
  return created.id;
}

function lexical(paragraphs: string[] = []) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        textFormat: 0,
        textStyle: "",
        children: [{ type: "text", detail: 0, format: 0, mode: "normal", style: "", text, version: 1 }]
      }))
    }
  };
}

function categoryFromHref(href = "") {
  return new URL(href, "https://raio.local").searchParams.get("kategooria") || "puidust-vahendid";
}

function pageStyle(kind: "dark" | "light" | "footer" = "light") {
  const colors = {
    dark: { background: "#2b241b", text: "#f8f3ec" },
    light: { background: "#f0e9dd", text: "#221c14" },
    footer: { background: "#e6ceb0", text: "#40342a" }
  }[kind];
  return {
    styleBackgroundColor: colors.background,
    styleTextColor: colors.text,
    styleHeadingFont: "inherit",
    styleBodyFont: "inherit"
  };
}

async function pageEditorData(locale: "et" | "en") {
  const m = messages[locale];
  const nav = Object.fromEntries(m.header.primaryNav.map((item: any) => [item.key, item.label]));
  const image = (url: string, alt?: string) => ensureMedia(url, alt);

  return {
    navigation: {
      trainings: nav.treeningud,
      tools: nav.vahendid,
      events: nav.sundmused,
      shop: nav.pood,
      about: nav.meist,
      journal: nav.journal
    },
    footer: {
      slogan: m.footer.slogan,
      instagramLabel: m.footer.instagramLabel,
      instagramUrl: "https://www.instagram.com/ra.ioworld",
      ...pageStyle("footer")
    },
    homeHero: {
      eyebrow: m.home.hero.eyebrow,
      title: m.home.hero.titleStart,
      accent: m.home.hero.titleAccent,
      text: m.home.hero.copy,
      image: await image(m.home.hero.image, m.home.hero.imageAlt),
      ...pageStyle("dark")
    },
    homePhilosophy: {
      eyebrow: m.home.philosophy.eyebrow,
      title: m.home.philosophy.headingStart,
      accent: m.home.philosophy.headingAccent,
      text: m.home.philosophy.body,
      image: await image(m.home.philosophy.image, m.home.philosophy.imageAlt),
      ...pageStyle("dark")
    },
    homeTools: {
      eyebrow: m.home.tools.eyebrow,
      title: m.home.tools.headingStart,
      accent: m.home.tools.headingAccent,
      text: m.home.tools.copy,
      image: await image(m.home.tools.image, m.home.tools.imageAlt),
      ...pageStyle("dark")
    },
    homeCards: await Promise.all(m.home.categoryWorld.cards.map(async (card: any) => ({
      route: card.path,
      title: card.title,
      subtitle: card.subtitle,
      image: await image(card.image, card.alt)
    }))),
    homeCardsStyle: pageStyle("dark"),
    trainingHero: {
      title: m.training.heroTitle,
      text: m.training.heroText.join("\n"),
      image: await image(m.training.heroImage, m.training.heroTitle),
      mobileImage: await image(m.training.heroImageMobile, m.training.heroTitle),
      ...pageStyle("dark")
    },
    trainingCarousel: {
      title: m.training.listTitle,
      cta: m.training.cardCta,
      qualities: m.training.qualities.map((item: any) => ({ title: item.title })),
      ...pageStyle("light")
    },
    trainingLasting: {
      title: m.training.lasting.title,
      text: m.training.lasting.text,
      cta: m.training.lasting.cta,
      image: await image(m.training.lasting.image, m.training.lasting.imageAlt),
      ...pageStyle("dark")
    },
    trainingWorkshop: { ...m.training.workshop, ...pageStyle("light") },
    toolsHero: {
      title: m.tools.heroTitle,
      text: m.tools.heroText.join("\n"),
      image: await image(m.tools.heroImage, m.tools.heroTitle),
      mobileImage: await image(m.tools.heroImageMobile, m.tools.heroTitle),
      ...pageStyle("dark")
    },
    toolsCarousel: {
      title: m.tools.categoriesTitle,
      cta: m.tools.categoryCta,
      proofLabels: m.tools.heroProof.map((item: any) => ({ label: item.label })),
      ...pageStyle("light")
    },
    toolsMaterial: {
      title: m.tools.material.title,
      text: m.tools.material.text,
      image: await image(m.tools.material.image, m.tools.material.imageAlt),
      ...pageStyle("light")
    },
    toolsCare: {
      title: m.tools.care.title,
      text: m.tools.care.lines.join("\n"),
      image: await image(m.tools.care.image, m.tools.care.imageAlt),
      ...pageStyle("dark")
    },
    eventsHero: {
      title: m.events.heroTitle,
      text: m.events.heroText.join("\n"),
      image: await image(m.events.heroImage, m.events.heroTitle),
      mobileImage: await image(m.events.heroImageMobile, m.events.heroTitle),
      ...pageStyle("dark")
    },
    eventsCarousel: { title: m.events.upcomingTitle, cta: m.events.cardCta, ...pageStyle("light") },
    eventsHost: {
      title: m.events.host.title,
      text: m.events.host.text,
      cta: m.events.host.cta,
      image: await image(m.events.host.image, m.events.host.imageAlt),
      ...pageStyle("dark")
    },
    shopHero: {
      title: m.shop.heroTitle,
      accent: m.shop.heroNote,
      text: m.shop.heroText,
      image: await image(m.shop.heroImage, m.shop.heroTitle),
      mobileImage: await image(m.shop.heroImageMobile, m.shop.heroTitle),
      ...pageStyle("dark")
    },
    shopProducts: { title: m.shop.productsTitle, ...pageStyle("light") },
    shopCustom: {
      title: m.tools.custom.title,
      text: m.tools.custom.lines.join("\n"),
      cta: m.tools.custom.cta,
      image: await image(m.tools.custom.image, m.tools.custom.imageAlt),
      ...pageStyle("dark")
    },
    aboutHero: {
      title: m.about.heroTitle,
      text: m.about.heroText.join("\n"),
      image: await image(m.about.heroImage, m.about.heroTitle),
      mobileImage: await image(m.about.heroImageMobile, m.about.heroTitle),
      ...pageStyle("dark")
    },
    aboutStory: {
      title: m.about.storyTitle,
      text: m.about.story.join("\n"),
      image: await image(m.about.storyImage, m.about.storyImageAlt),
      ...pageStyle("light")
    },
    aboutTrainers: {
      title: m.about.trainersTitle,
      items: await Promise.all(m.about.trainers.map(async (trainer: any) => ({
        name: trainer.name,
        text: trainer.text,
        image: await image(trainer.image, trainer.imageAlt)
      }))),
      ...pageStyle("dark")
    },
    aboutClosing: {
      title: m.about.closingTitle,
      values: m.about.values.map((value: any) => ({ title: value.title, text: value.text })),
      contactTitle: m.about.contactPanel.title,
      instagramLabel: m.about.contactPanel.instagram,
      ...pageStyle("dark")
    },
    journalHero: {
      title: m.journal.heroTitle,
      text: m.journal.heroText.join("\n"),
      image: await image(m.journal.heroImage, m.journal.heroTitle),
      mobileImage: await image(m.journal.heroImageMobile, m.journal.heroTitle),
      ...pageStyle("dark")
    },
    journalCarousel: { title: m.journal.storiesTitle, cta: m.journal.readMore, ...pageStyle("light") },
    journalSignup: {
      title: m.journal.signup.title,
      text: m.journal.signup.text,
      cta: m.journal.signup.cta,
      image: await image(m.journal.signupImage || "/Pictures/Journal/RAIO MEIST1.png", m.journal.signup.title),
      ...pageStyle("dark")
    }
  };
}

async function seedPageEditor() {
  const current = await payload.findGlobal({ slug: "page-editor", locale: "et", depth: 0 });
  if (!force && (current?.homeHero?.title || current?.navigation?.trainings)) {
    summary.pageEditor = "jäeti alles (juba täidetud)";
    return;
  }
  for (const locale of ["et", "en"] as const) {
    await payload.updateGlobal({
      slug: "page-editor",
      locale,
      overrideAccess: true,
      data: await pageEditorData(locale)
    });
  }
  summary.pageEditor = "täidetud";
}

async function seedProducts() {
  const count = await payload.count({ collection: "products" });
  if (count.totalDocs) return void (summary.products = `${count.totalDocs} olemas`);

  for (let index = 0; index < shopProducts.length; index += 1) {
    const base = shopProducts[index];
    const et = messages.et.shop.products[base.slug];
    const en = messages.en.shop.products[base.slug];
    const images = (await Promise.all(base.images.map((url) => ensureMedia(url, et.name)))).filter(Boolean);
    const doc = await payload.create({
      collection: "products",
      locale: "et",
      overrideAccess: true,
      data: {
        name: et.name,
        slug: base.slug,
        sku: `RAIO-${String(index + 1).padStart(3, "0")}`,
        description: et.description,
        price: base.price,
        category: base.category,
        status: base.status,
        images,
        estimatedProductionTime: et.estimatedProductionTime,
        productionNote: et.productionNote,
        sortOrder: (index + 1) * 10,
        visible: true
      }
    });
    await payload.update({ collection: "products", id: doc.id, locale: "en", overrideAccess: true, data: {
      name: en.name, description: en.description, estimatedProductionTime: en.estimatedProductionTime, productionNote: en.productionNote
    } });
  }
  summary.products = shopProducts.length;
}

async function seedTrainings() {
  const count = await payload.count({ collection: "trainings" });
  if (count.totalDocs) return void (summary.trainings = `${count.totalDocs} olemas`);
  for (let index = 0; index < messages.et.training.trainings.length; index += 1) {
    const et = messages.et.training.trainings[index];
    const en = messages.en.training.trainings[index];
    const doc = await payload.create({ collection: "trainings", locale: "et", overrideAccess: true, data: {
      title: et.title, description: et.description, duration: et.duration, level: et.level,
      image: await ensureMedia(et.image, et.title), content: lexical(et.body), sortOrder: (index + 1) * 10, visible: true
    } });
    await payload.update({ collection: "trainings", id: doc.id, locale: "en", overrideAccess: true, data: {
      title: en.title, description: en.description, duration: en.duration, level: en.level, content: lexical(en.body)
    } });
  }
  summary.trainings = messages.et.training.trainings.length;
}

async function seedEvents() {
  const count = await payload.count({ collection: "events" });
  if (count.totalDocs) return void (summary.events = `${count.totalDocs} olemas`);
  const dates = ["2024-05-25", "2024-06-08", "2024-06-22", "2024-07-13"];
  for (let index = 0; index < messages.et.events.events.length; index += 1) {
    const et = messages.et.events.events[index];
    const en = messages.en.events.events[index];
    const doc = await payload.create({ collection: "events", locale: "et", overrideAccess: true, data: {
      title: et.title, date: dates[index], location: et.location, description: et.description,
      content: lexical(et.body), image: await ensureMedia(et.image, et.title), imagePosition: et.imagePosition,
      sortOrder: (index + 1) * 10, visible: true
    } });
    await payload.update({ collection: "events", id: doc.id, locale: "en", overrideAccess: true, data: {
      title: en.title, location: en.location, description: en.description, content: lexical(en.body)
    } });
  }
  summary.events = messages.et.events.events.length;
}

async function seedToolCards() {
  const count = await payload.count({ collection: "tool-cards" });
  if (count.totalDocs) return void (summary.toolCards = `${count.totalDocs} olemas`);
  for (let index = 0; index < messages.et.tools.categories.length; index += 1) {
    const et = messages.et.tools.categories[index];
    const en = messages.en.tools.categories[index];
    const doc = await payload.create({ collection: "tool-cards", locale: "et", overrideAccess: true, data: {
      title: et.title, description: et.description, image: await ensureMedia(et.image, et.title),
      category: categoryFromHref(et.href), sortOrder: (index + 1) * 10, visible: true
    } });
    await payload.update({ collection: "tool-cards", id: doc.id, locale: "en", overrideAccess: true, data: {
      title: en.title, description: en.description
    } });
  }
  summary.toolCards = messages.et.tools.categories.length;
}

async function seedJournal() {
  const count = await payload.count({ collection: "journal-articles" });
  if (count.totalDocs) return void (summary.journal = `${count.totalDocs} olemas`);
  const dates = ["2024-05-23", "2024-05-12", "2024-05-05", "2024-04-28", "2024-04-17", "2024-04-09"];
  const categoryMap: Record<string, string> = { Treening: "treening", Loodus: "loodus", Käsitöö: "kasitoo", Mõtted: "motted" };
  for (let index = 0; index < messages.et.journal.articles.length; index += 1) {
    const et = messages.et.journal.articles[index];
    const en = messages.en.journal.articles[index];
    const doc = await payload.create({ collection: "journal-articles", locale: "et", overrideAccess: true, data: {
      title: et.title, slug: `raio-lugu-${index + 1}`, category: categoryMap[et.category] || "motted",
      publishedAt: dates[index], excerpt: et.excerpt, image: await ensureMedia(et.image, et.title),
      content: lexical(et.body), sortOrder: (index + 1) * 10, visible: true
    } });
    await payload.update({ collection: "journal-articles", id: doc.id, locale: "en", overrideAccess: true, data: {
      title: en.title, excerpt: en.excerpt, content: lexical(en.body)
    } });
  }
  summary.journal = messages.et.journal.articles.length;
}

async function seedSettings() {
  const current = await payload.findGlobal({ slug: "site-settings", locale: "et" });
  if (current?.email) return void (summary.settings = "juba täidetud");
  await payload.updateGlobal({ slug: "site-settings", locale: "et", overrideAccess: true, data: {
    brandName: messages.et.brand.name,
    companyName: messages.et.brand.company,
    registryCode: messages.et.brand.registrationCode,
    footerSlogan: messages.et.footer.slogan,
    email: messages.et.brand.email,
    instagramUrl: "https://www.instagram.com/ra.ioworld"
  } });
  await payload.updateGlobal({ slug: "site-settings", locale: "en", overrideAccess: true, data: {
    brandName: messages.en.brand.name, footerSlogan: messages.en.footer.slogan
  } });
  summary.settings = "täidetud";
}

await seedPageEditor();
await seedProducts();
await seedTrainings();
await seedEvents();
await seedToolCards();
await seedJournal();
await seedSettings();

summary.media = mediaCache.size;
console.log("\nAdmini algsisu import valmis:");
console.table(summary);
process.exit(0);
