import { LEGAL_DOCS } from "@/lib/legal-content";
import { LegalHubCard } from "@/components/legal/legal-hub-card";

export default function LegalHubPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            Legal
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Clear legal info, without the headache.
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            These pages are written to be readable first. Each one starts with a
            plain-English summary, then gives the full legal wording underneath.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {LEGAL_DOCS.map((doc) => (
            <LegalHubCard key={doc.key} doc={doc} />
          ))}
        </div>
      </section>
    </main>
  );
}