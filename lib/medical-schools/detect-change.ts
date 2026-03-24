import type { DetectedChange } from "@/lib/medical-schools/types/medical-schools";

function clip(text: string | null, max = 600) {
  if (!text) return null;
  return text.length <= max ? text : `${text.slice(0, max).trim()}...`;
}

function countKeywordHits(text: string) {
  const lower = text.toLowerCase();

  const highValueKeywords = [
    "doctor of medicine",
    "medicine",
    "md",
    "provisional entry",
    "graduate entry",
    "pathway",
    "new pathway",
    "applications open",
    "applications close",
    "application dates",
    "deadline",
    "ucat",
    "ucat anz",
    "atar",
    "adjusted atar",
    "interview",
    "mmi",
    "selection criteria",
    "prerequisite",
    "offer",
    "intake",
    "quota",
    "rural",
    "bonded",
    "scholarship",
  ];

  let hits = 0;

  for (const keyword of highValueKeywords) {
    if (lower.includes(keyword)) hits++;
  }

  return hits;
}

function inferPriority(oldText: string | null, newText: string): "low" | "medium" | "high" {
  const oldLen = oldText?.length ?? 0;
  const newLen = newText.length;
  const delta = Math.abs(newLen - oldLen);
  const keywordHits = countKeywordHits(newText);

  if (keywordHits >= 6) return "high";
  if (delta >= 2500) return "high";
  if (keywordHits >= 3) return "medium";
  if (delta >= 700) return "medium";

  return "low";
}

function buildSummary(oldText: string | null, newText: string, changed: boolean) {
  if (!oldText) {
    return "Initial snapshot captured for this source.";
  }

  if (!changed) {
    return "No change detected.";
  }

  const lower = newText.toLowerCase();

  if (
    lower.includes("doctor of medicine") ||
    lower.includes("new pathway") ||
    lower.includes("provisional entry")
  ) {
    return "Medicine pathway or program information changed and needs review.";
  }

  if (
    lower.includes("atar") ||
    lower.includes("ucat") ||
    lower.includes("interview") ||
    lower.includes("mmi") ||
    lower.includes("selection criteria")
  ) {
    return "Admissions-related information changed and needs review.";
  }

  if (
    lower.includes("applications open") ||
    lower.includes("applications close") ||
    lower.includes("deadline") ||
    lower.includes("intake")
  ) {
    return "Application timing or intake information changed and needs review.";
  }

  return "Official page content changed and needs review.";
}

export function detectChanges(params: {
  oldHash: string | null;
  newHash: string;
  oldText: string | null;
  newText: string;
}): DetectedChange {
  const { oldHash, newHash, oldText, newText } = params;

  const hasExistingSnapshot = !!oldHash && !!oldText;
  const changed = hasExistingSnapshot ? oldHash !== newHash : false;

  if (!hasExistingSnapshot) {
    return {
      changed: false,
      oldHash,
      newHash,
      oldExcerpt: null,
      newExcerpt: clip(newText),
      summary: "Initial snapshot captured for this source.",
      priority: "low",
    };
  }

  if (!changed) {
    return {
      changed: false,
      oldHash,
      newHash,
      oldExcerpt: clip(oldText),
      newExcerpt: clip(newText),
      summary: "No change detected.",
      priority: "low",
    };
  }

  const priority = inferPriority(oldText, newText);
  const summary = buildSummary(oldText, newText, true);

  return {
    changed: true,
    oldHash,
    newHash,
    oldExcerpt: clip(oldText),
    newExcerpt: clip(newText),
    summary,
    priority,
  };
}