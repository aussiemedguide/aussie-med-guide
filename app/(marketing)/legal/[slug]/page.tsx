import { notFound } from "next/navigation";
import { LEGAL_DOCS } from "@/lib/legal-content";
import { getLegalDocBySlug } from "@/lib/legal-utils";
import { LegalSummaryStrip } from "@/components/legal/legal-summary-strip";

export function generateStaticParams() {
  return LEGAL_DOCS.map((doc) => ({ slug: doc.slug }));
}

export default async function LegalDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getLegalDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            Last updated {doc.lastUpdated}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {doc.title}
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-600">
            {doc.description}
          </p>
        </div>

        <div className="mt-6">
          <LegalSummaryStrip points={doc.summaryPoints} />
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-8">
            {doc.sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  {section.title}
                </h2>

                <div className="space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}