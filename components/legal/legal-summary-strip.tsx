type LegalSummaryStripProps = {
  points: string[];
};

export function LegalSummaryStrip({ points }: LegalSummaryStripProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
        In plain English
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {points.map((point) => (
          <div
            key={point}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
          >
            {point}
          </div>
        ))}
      </div>
    </div>
  );
}