import type { DetectedChange } from "@/types/medical-schools";

function clip(text: string, max = 600) {
  return text.length <= max ? text : `${text.slice(0, max)}...`;
}

export function detectChanges(params: {
  oldHash: string | null;
  newHash: string;
  oldText: string | null;
  newText: string;
}): DetectedChange {
  const { oldHash, newHash, oldText, newText } = params;

  if (!oldHash || !oldText) {
    return {
      changed: true,
      oldHash,
      newHash,
      oldExcerpt: null,
      newExcerpt: clip(newText),
      summary: "Initial snapshot captured for this source.",
      priority: "low",
    };
  }

  if (oldHash === newHash) {
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

  const oldLen = oldText.length;
  const newLen = newText.length;
  const delta = Math.abs(newLen - oldLen);

  let priority: "low" | "medium" | "high" = "medium";
  if (delta > 3000) priority = "high";
  if (delta < 500) priority = "low";

  return {
    changed: true,
    oldHash,
    newHash,
    oldExcerpt: clip(oldText),
    newExcerpt: clip(newText),
    summary: "Official page content changed and needs review.",
    priority,
  };
}