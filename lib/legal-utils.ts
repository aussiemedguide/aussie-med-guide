import { LEGAL_DOCS } from "@/lib/legal-content";

export function getLegalDocBySlug(slug: string) {
  return LEGAL_DOCS.find((doc) => doc.slug === slug);
}