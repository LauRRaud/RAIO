import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const ROOT = process.cwd();
const DEFAULT_ROUTES = [
  "/",
  "/treeningud",
  "/vahendid",
  "/sundmused",
  "/journal",
  "/pood",
  "/meist",
  "/kontakt",
  "/ostukorv"
];

const SKIP_DIRS = new Set([
  ".git",
  ".next",
  ".codex",
  ".agents",
  "node_modules",
  "output"
]);

const args = parseArgs(process.argv.slice(2));
const baseUrl = normalizeBaseUrl(args["base-url"] || "http://localhost:3000");
const headless = readBoolean(args.headless, false);
const includeEnglish = readBoolean(args.en, true);
const includeProducts = readBoolean(args.products, true);
const maxHover = Number(args["max-hover"] || 60);
const scrollSteps = Number(args["scroll-steps"] || 3);
const viewport = parseViewport(args.viewport || "1440x900");
const outDir = path.resolve(ROOT, args.out || path.join("output", "ui-audit", timestamp()));
const routeOverride = args.routes ? args.routes.split(",").map((route) => normalizeRoute(route.trim())) : null;

fs.mkdirSync(outDir, { recursive: true });

const routes = routeOverride || await getRoutes({ includeEnglish, includeProducts });
const staticIndex = buildStaticIndex();

const browser = await chromium.launch({ headless });
const context = await browser.newContext({
  viewport,
  deviceScaleFactor: 1,
  colorScheme: "light"
});
const page = await context.newPage();

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  viewport,
  options: {
    headless,
    includeEnglish,
    includeProducts,
    maxHover,
    scrollSteps
  },
  static: staticIndex.summary,
  pages: [],
  classAudit: null
};

for (const route of routes) {
  report.pages.push(await auditRoute(page, route));
}

await browser.close();

report.classAudit = buildClassAudit(staticIndex, report.pages);

const jsonPath = path.join(outDir, "ui-audit-report.json");
const mdPath = path.join(outDir, "ui-audit-report.md");
fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");
fs.writeFileSync(mdPath, renderMarkdown(report), "utf8");

console.log(`UI audit complete`);
console.log(`JSON: ${jsonPath}`);
console.log(`Markdown: ${mdPath}`);

async function auditRoute(page, route) {
  const url = `${baseUrl}${route}`;
  const consoleMessages = [];
  const onConsole = (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push({
        type: message.type(),
        text: message.text()
      });
    }
  };

  page.on("console", onConsole);

  const startedAt = Date.now();
  let response = null;
  let routeError = null;

  try {
    response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
  } catch (error) {
    routeError = error.message;
  }

  const safeName = safeRouteName(route);
  const screenshotPath = path.join(outDir, `${safeName}.png`);
  const scrollScreenshots = [];

  if (!routeError) {
    await page.screenshot({ path: screenshotPath, fullPage: false });
    await scrollAndCapture(page, safeName, scrollScreenshots);
  }

  const snapshot = routeError ? null : await page.evaluate(collectPageSnapshot);
  const hover = routeError ? [] : await collectHoverStates(page, maxHover);

  page.off("console", onConsole);

  const renderedClasses = new Set(snapshot?.classes || []);
  const visibleClasses = new Set(snapshot?.visibleClasses || []);

  return {
    route,
    requestedUrl: url,
    finalUrl: routeError ? null : page.url(),
    title: routeError ? null : await page.title(),
    status: response?.status() || null,
    ok: !routeError && !!response && response.status() < 400,
    durationMs: Date.now() - startedAt,
    error: routeError,
    screenshot: relativeOut(screenshotPath),
    scrollScreenshots,
    consoleMessages,
    metrics: snapshot?.metrics || null,
    elements: snapshot?.elements || [],
    elementCount: snapshot?.elements?.length || 0,
    classes: [...renderedClasses].sort(),
    visibleClasses: [...visibleClasses].sort(),
    hover,
    hoverChanges: hover.filter((item) => item.changed).length
  };
}

async function scrollAndCapture(page, safeName, target) {
  const metrics = await page.evaluate(() => ({
    viewportHeight: window.innerHeight,
    scrollHeight: document.documentElement.scrollHeight
  }));

  const maxY = Math.max(0, metrics.scrollHeight - metrics.viewportHeight);
  const steps = Math.max(1, scrollSteps);

  for (let index = 0; index < steps; index += 1) {
    const y = steps === 1 ? 0 : Math.round((maxY * index) / (steps - 1));
    await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
    await page.waitForTimeout(120);
    const file = path.join(outDir, `${safeName}-scroll-${index + 1}.png`);
    await page.screenshot({ path: file, fullPage: false });
    target.push({
      y,
      screenshot: relativeOut(file)
    });
  }

  await page.evaluate(() => window.scrollTo(0, 0));
}

async function collectHoverStates(page, limit) {
  const candidates = await page.evaluate((max) => {
    const compactText = (value) => (value || "").replace(/\s+/g, " ").trim().slice(0, 140);
    const roundedRect = (rect) => ({
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    });
    const hoverStyle = (element) => {
      const style = getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderColor,
        opacity: style.opacity,
        transform: style.transform,
        boxShadow: style.boxShadow,
        textDecorationLine: style.textDecorationLine
      };
    };
    const cssPath = (element) => {
      if (element.id) return `#${CSS.escape(element.id)}`;
      const parts = [];
      let current = element;

      while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
        const tag = current.tagName.toLowerCase();
        const classPart = [...current.classList].slice(0, 3).map((name) => `.${CSS.escape(name)}`).join("");
        const parent = current.parentElement;
        const siblings = parent ? [...parent.children].filter((child) => child.tagName === current.tagName) : [];
        const index = siblings.length > 1 ? `:nth-of-type(${siblings.indexOf(current) + 1})` : "";
        parts.unshift(`${tag}${classPart}${index}`);
        current = parent;
      }

      return parts.join(" > ");
    };

    const selector = [
      "a",
      "button",
      "[role='button']",
      "summary",
      "[class*='card']",
      "[class*='button']",
      "[class*='link']",
      "[class*='item']",
      "[class*='nav']"
    ].join(",");

    const seen = new Set();
    const nodes = [];

    for (const element of document.querySelectorAll(selector)) {
      if (!(element instanceof HTMLElement)) continue;
      if (seen.has(element)) continue;
      seen.add(element);

      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const visible = rect.width > 4 && rect.height > 4 && style.visibility !== "hidden" && style.display !== "none";
      if (!visible) continue;

      const path = cssPath(element);
      nodes.push({
        path,
        tag: element.tagName.toLowerCase(),
        text: compactText(element.textContent),
        classes: [...element.classList],
        href: element.getAttribute("href"),
        rect: roundedRect(rect),
        before: hoverStyle(element)
      });

      if (nodes.length >= max) break;
    }

    return nodes;
  }, limit);

  const results = [];

  for (const candidate of candidates) {
    const locator = page.locator(candidate.path).first();
    try {
      await locator.hover({ timeout: 3000 });
      await page.waitForTimeout(80);
      const after = await locator.evaluate((element) => ({
        backgroundColor: getComputedStyle(element).backgroundColor,
        color: getComputedStyle(element).color,
        borderColor: getComputedStyle(element).borderColor,
        opacity: getComputedStyle(element).opacity,
        transform: getComputedStyle(element).transform,
        boxShadow: getComputedStyle(element).boxShadow,
        textDecorationLine: getComputedStyle(element).textDecorationLine
      }));

      results.push({
        ...candidate,
        after,
        changed: JSON.stringify(candidate.before) !== JSON.stringify(after)
      });
    } catch (error) {
      results.push({
        ...candidate,
        error: error.message,
        changed: false
      });
    }
  }

  return results;
}

function collectPageSnapshot() {
  const compactText = (value) => (value || "").replace(/\s+/g, " ").trim().slice(0, 180);
  const roundedRect = (rect) => ({
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height)
  });
  const cssPath = (element) => {
    if (element.id) return `#${CSS.escape(element.id)}`;
    const parts = [];
    let current = element;

    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
      const tag = current.tagName.toLowerCase();
      const classPart = [...current.classList].slice(0, 3).map((name) => `.${CSS.escape(name)}`).join("");
      const parent = current.parentElement;
      const siblings = parent ? [...parent.children].filter((child) => child.tagName === current.tagName) : [];
      const index = siblings.length > 1 ? `:nth-of-type(${siblings.indexOf(current) + 1})` : "";
      parts.unshift(`${tag}${classPart}${index}`);
      current = parent;
    }

    return parts.join(" > ");
  };

  const elements = [];
  const classes = new Set();
  const visibleClasses = new Set();

  for (const element of document.querySelectorAll("body *")) {
    if (!(element instanceof Element)) continue;

    for (const className of element.classList) classes.add(className);

    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const visible = rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";

    if (visible) {
      for (const className of element.classList) visibleClasses.add(className);
    }

    const interesting =
      visible &&
      (element.classList.length > 0 ||
        ["a", "button", "input", "select", "textarea", "img", "h1", "h2", "h3", "section", "article", "header", "footer", "main"].includes(element.tagName.toLowerCase()));

    if (!interesting) continue;

    elements.push({
      path: cssPath(element),
      tag: element.tagName.toLowerCase(),
      id: element.id || null,
      classes: [...element.classList],
      text: compactText(element.textContent),
      role: element.getAttribute("role"),
      ariaLabel: element.getAttribute("aria-label"),
      href: element.getAttribute("href"),
      src: element.getAttribute("src"),
      visible,
      rect: roundedRect(rect),
      styles: {
        display: style.display,
        position: style.position,
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderColor,
        fontSize: style.fontSize,
        opacity: style.opacity,
        zIndex: style.zIndex,
        objectFit: style.objectFit || null,
        objectPosition: style.objectPosition || null
      }
    });
  }

  return {
    metrics: {
      url: location.href,
      title: document.title,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
      bodyClass: document.body.className,
      theme: document.body.getAttribute("data-theme") || "default"
    },
    classes: [...classes],
    visibleClasses: [...visibleClasses],
    elements
  };
}

function buildStaticIndex() {
  const cssFiles = walk(path.join(ROOT, "app", "styles"), (file) => file.endsWith(".css"));
  const sourceFiles = walk(ROOT, (file) => /\.(jsx?|mjs|json)$/.test(file));

  const cssClassFiles = new Map();
  const sourceClassFiles = new Map();

  for (const file of cssFiles) {
    const text = fs.readFileSync(file, "utf8");
    for (const className of extractCssClasses(text)) {
      addMapSet(cssClassFiles, className, rel(file));
    }
  }

  for (const file of sourceFiles) {
    const text = fs.readFileSync(file, "utf8");
    for (const className of extractSourceClassRefs(text)) {
      addMapSet(sourceClassFiles, className, rel(file));
    }
  }

  return {
    cssClassFiles,
    sourceClassFiles,
    summary: {
      cssFileCount: cssFiles.length,
      sourceFileCount: sourceFiles.length,
      cssClassCount: cssClassFiles.size,
      sourceClassRefCount: sourceClassFiles.size
    }
  };
}

function buildClassAudit(staticIndex, pages) {
  const runtimeClassFiles = new Map();

  for (const page of pages) {
    for (const className of page.classes || []) {
      addMapSet(runtimeClassFiles, className, page.route);
    }
  }

  const cssClasses = new Set(staticIndex.cssClassFiles.keys());
  const sourceClasses = new Set(staticIndex.sourceClassFiles.keys());
  const runtimeClasses = new Set(runtimeClassFiles.keys());

  const possibleDeadCss = [...cssClasses]
    .filter((className) => !sourceClasses.has(className) && !runtimeClasses.has(className))
    .sort()
    .map((className) => ({
      className,
      cssFiles: [...staticIndex.cssClassFiles.get(className)]
    }));

  const cssNotRendered = [...cssClasses]
    .filter((className) => sourceClasses.has(className) && !runtimeClasses.has(className))
    .sort()
    .map((className) => ({
      className,
      cssFiles: [...staticIndex.cssClassFiles.get(className)],
      sourceFiles: [...staticIndex.sourceClassFiles.get(className)]
    }));

  const runtimeWithoutCss = [...runtimeClasses]
    .filter((className) => !cssClasses.has(className))
    .sort()
    .map((className) => ({
      className,
      routes: [...runtimeClassFiles.get(className)],
      sourceFiles: staticIndex.sourceClassFiles.has(className) ? [...staticIndex.sourceClassFiles.get(className)] : []
    }));

  return {
    cssClassCount: cssClasses.size,
    sourceClassRefCount: sourceClasses.size,
    runtimeClassCount: runtimeClasses.size,
    possibleDeadCss,
    cssNotRendered,
    runtimeWithoutCss
  };
}

async function getRoutes({ includeEnglish, includeProducts }) {
  const routes = [...DEFAULT_ROUTES];

  if (includeProducts) {
    const shop = await import(pathToFileURL(path.join(ROOT, "lib", "shop.js")).href);
    for (const product of shop.shopProducts || []) {
      routes.push(`/pood/${product.slug}`);
    }
  }

  if (includeEnglish) {
    const englishRoutes = routes.map((route) => (route === "/" ? "/en" : `/en${route}`));
    routes.push(...englishRoutes);
  }

  return [...new Set(routes)];
}

function extractCssClasses(text) {
  const withoutComments = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const matches = [...withoutComments.matchAll(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g)];
  return new Set(matches.map((match) => match[1]).filter((className) => !className.includes(".")));
}

function extractSourceClassRefs(text) {
  const refs = new Set();

  for (const match of text.matchAll(/className\s*=\s*["']([^"']+)["']/g)) {
    splitClasses(match[1]).forEach((className) => refs.add(className));
  }

  for (const match of text.matchAll(/className\s*=\s*\{`([^`]+)`\}/g)) {
    splitClasses(match[1].replace(/\$\{[^}]+\}/g, " ")).forEach((className) => refs.add(className));
  }

  for (const match of text.matchAll(/className\s*=\s*\{["']([^"']+)["']\}/g)) {
    splitClasses(match[1]).forEach((className) => refs.add(className));
  }

  for (const match of text.matchAll(/["'`]([_a-zA-Z][-_a-zA-Z0-9 ]{2,})["'`]/g)) {
    splitClasses(match[1]).forEach((className) => {
      if (className.includes("-")) refs.add(className);
    });
  }

  return refs;
}

function splitClasses(value) {
  return value
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/.test(item));
}

function renderMarkdown(report) {
  const failedPages = report.pages.filter((page) => !page.ok);
  const consolePages = report.pages.filter((page) => page.consoleMessages.length);
  const hoverPages = report.pages.map((page) => `${page.route}: ${page.hoverChanges}/${page.hover.length}`).join(", ");

  return [
    "# UI Audit Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Base URL: ${report.baseUrl}`,
    `Viewport: ${report.viewport.width}x${report.viewport.height}`,
    `Pages audited: ${report.pages.length}`,
    "",
    "## Summary",
    "",
    `- Failed pages: ${failedPages.length ? failedPages.map((page) => page.route).join(", ") : "none"}`,
    `- Pages with console warnings/errors: ${consolePages.length ? consolePages.map((page) => page.route).join(", ") : "none"}`,
    `- Hover changes: ${hoverPages}`,
    "",
    "## Dead CSS Candidates",
    "",
    "These classes exist in CSS but were not found in JSX/source strings or rendered DOM during this run.",
    "",
    table(
      ["Class", "CSS files"],
      report.classAudit.possibleDeadCss.slice(0, 200).map((item) => [
        `.${item.className}`,
        item.cssFiles.join("<br>")
      ])
    ),
    "",
    "## CSS Present In Source But Not Rendered",
    "",
    "These classes exist in CSS and source, but did not appear in the audited runtime routes. Treat as review candidates, not automatic deletions.",
    "",
    table(
      ["Class", "CSS files", "Source files"],
      report.classAudit.cssNotRendered.slice(0, 250).map((item) => [
        `.${item.className}`,
        item.cssFiles.join("<br>"),
        item.sourceFiles.join("<br>")
      ])
    ),
    "",
    "## Runtime Classes Without CSS",
    "",
    "These classes appeared in the DOM but were not found in app/styles CSS. Some may be browser/framework or intentionally unstyled utility classes.",
    "",
    table(
      ["Class", "Routes", "Source files"],
      report.classAudit.runtimeWithoutCss.slice(0, 250).map((item) => [
        `.${item.className}`,
        item.routes.join("<br>"),
        item.sourceFiles.join("<br>")
      ])
    ),
    "",
    "## Pages",
    "",
    table(
      ["Route", "Status", "Elements", "Classes", "Hover changes", "Screenshot"],
      report.pages.map((page) => [
        page.route,
        page.ok ? String(page.status) : `FAIL ${page.status || ""}`,
        String(page.elementCount),
        String(page.classes.length),
        `${page.hoverChanges}/${page.hover.length}`,
        page.screenshot
      ])
    ),
    "",
    "## How To Use This Report",
    "",
    "- Start with `possibleDeadCss`; these are the safest deletion candidates.",
    "- Check `cssNotRendered` against conditional UI, mobile-only UI, theme-only UI, cart-filled state, and language-specific UI before deleting.",
    "- Use each page's `elements` and `hover` arrays in `ui-audit-report.json` to trace rendered classes back to CSS and JSX files.",
    "- Re-run after deleting CSS and compare `runtimeWithoutCss` plus screenshots."
  ].join("\n");
}

function table(headers, rows) {
  if (!rows.length) return "_None._";
  const header = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(escapeTable).join(" | ")} |`);
  return [header, sep, ...body].join("\n");
}

function escapeTable(value) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, "<br>");
}

function walk(dir, predicate, output = []) {
  if (!fs.existsSync(dir)) return output;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, output);
    else if (predicate(full)) output.push(full);
  }

  return output;
}

function addMapSet(map, key, value) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

function parseArgs(argv) {
  const parsed = {};

  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const [key, ...rest] = arg.slice(2).split("=");
    parsed[key] = rest.length ? rest.join("=") : true;
  }

  return parsed;
}

function parseViewport(value) {
  const [width, height] = value.split("x").map((part) => Number(part));
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    throw new Error(`Invalid viewport "${value}". Use WIDTHxHEIGHT, for example 1440x900.`);
  }
  return { width, height };
}

function readBoolean(value, fallback) {
  if (value === undefined) return fallback;
  if (value === true) return true;
  return !["0", "false", "no"].includes(String(value).toLowerCase());
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function normalizeRoute(route) {
  if (!route) return "/";
  return route.startsWith("/") ? route : `/${route}`;
}

function safeRouteName(route) {
  return route === "/" ? "home" : route.replace(/^\/+/, "").replace(/[^a-zA-Z0-9_-]+/g, "-");
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, "/");
}

function relativeOut(file) {
  return path.relative(outDir, file).replace(/\\/g, "/");
}
