import config from "@payload-config";
import { getPayload } from "payload";

const categoryLabels = {
  et: {
    treening: "Treening",
    loodus: "Loodus",
    kasitoo: "Käsitöö",
    motted: "Mõtted"
  },
  en: {
    treening: "Training",
    loodus: "Nature",
    kasitoo: "Craft",
    motted: "Thoughts"
  }
};

function getUploadUrl(upload, fallback = "") {
  if (!upload || typeof upload !== "object") return fallback;
  return upload.url || fallback;
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

export async function getJournalArticles(locale = "et", fallbackArticles = []) {
  try {
    const payload = await getPayload({ config });
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
        category: categoryLabels[locale]?.[article.category] || article.category || "",
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
