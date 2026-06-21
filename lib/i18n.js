export const locales = ["et", "en"];
export const defaultLocale = "et";

export function isLocale(value) {
  return locales.includes(value);
}

export function getLocalizedPath(locale, path) {
  if (locale === "en") {
    return path === "/" ? "/en" : `/en${path}`;
  }

  return path;
}

export function getAlternateLocale(locale) {
  return locale === "en" ? "et" : "en";
}
