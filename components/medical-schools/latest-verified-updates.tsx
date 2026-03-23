type UpdateItem = {
  id: number;
  summary: string | null;
  detected_at: string;
  priority: string;
  url: string;
};

export function LatestVerifiedUpdates({
  updates,
}: {
  updates: UpdateItem[];
}) {
  if (!updates.length) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-slate-900">
        Latest Verified Updates
      </h3>

      <div className="mt-4 space-y-3">
        {updates.map((update) => (
          <div
            key={update.id}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <p className="text-sm font-medium text-slate-900">
              {update.summary ?? "Verified update published."}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {new Date(update.detected_at).toLocaleDateString()}
            </p>
            <a
              href={update.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-medium text-emerald-700"
            >
              View source
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}