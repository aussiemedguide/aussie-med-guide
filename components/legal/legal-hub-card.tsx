import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LegalDoc } from "@/lib/legal-content";

export function LegalHubCard({ doc }: { doc: LegalDoc }) {
  return (
    <Link
      href={`/legal/${doc.slug}`}
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
        {doc.shortTitle}
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-slate-900">
        {doc.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{doc.description}</p>

      <div className="mt-4 space-y-2">
        {doc.summaryPoints.slice(0, 2).map((point) => (
          <p key={point} className="text-sm leading-6 text-slate-700">
            • {point}
          </p>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
        Read document
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}