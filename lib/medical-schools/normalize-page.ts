import * as cheerio from "cheerio";
import type { NormalizedPage } from "@/lib/medical-schools/types/medical-schools";

function cleanText(input: string) {
  return input
    .replace(/\u00a0/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function removeNoise($: cheerio.CheerioAPI) {
  const junkSelectors = [
    "script",
    "style",
    "noscript",
    "svg",
    "img",
    "iframe",
    "form",
    "button",
    "header",
    "footer",
    "nav",
    "aside",
    '[role="navigation"]',
    '[role="banner"]',
    '[role="contentinfo"]',
    ".breadcrumb",
    ".breadcrumbs",
    ".cookie-banner",
    ".cookie-consent",
    ".consent-banner",
    ".site-header",
    ".site-footer",
    ".header",
    ".footer",
    ".menu",
    ".mobile-menu",
    ".nav",
    ".navbar",
    ".share",
    ".social-share",
    ".related",
    ".related-content",
    ".newsletter",
    ".promo",
    ".advertisement",
    ".ads",
    ".search",
    ".pagination",
    ".sidebar",
    ".utility-nav",
    ".skip-link",
  ];

  for (const selector of junkSelectors) {
    $(selector).remove();
  }
}

function extractBestTitle($: cheerio.CheerioAPI): string | null {
  const h1 = cleanText($("h1").first().text());
  if (h1) return h1;

  const title = cleanText($("title").first().text());
  if (title) return title;

  return null;
}

function extractBestText($: cheerio.CheerioAPI): string {
  const candidates = [
    "main",
    "article",
    '[role="main"]',
    ".main-content",
    ".content",
    ".page-content",
    ".story-body",
    ".article-body",
    ".entry-content",
    ".node__content",
  ];

  for (const selector of candidates) {
    const text = cleanText($(selector).first().text());
    if (text && text.length > 200) {
      return text;
    }
  }

  return cleanText($("body").text());
}

function makeExcerpt(text: string, max = 500) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

export function normalizePage(html: string): NormalizedPage {
  const $ = cheerio.load(html);

  removeNoise($);

  const title = extractBestTitle($);

  let normalizedText = extractBestText($);

  // TEMP DEBUG SWITCH:
  // Set FORCE_MEDICAL_SCHOOL_TEST_CHANGE=true in .env.local
  // when you want to force a hash change and test medical_school_updates.
  if (process.env.FORCE_MEDICAL_SCHOOL_TEST_CHANGE === "true") {
    normalizedText = `${normalizedText} forced-test-change`;
  }

  const excerpt = makeExcerpt(normalizedText);

  return {
    title,
    normalizedText,
    excerpt,
    textLength: normalizedText.length,
  };
}