import { createAdminClient } from "@/lib/supabase/admin";

type MedicalSchoolUpdate = {
  id: number;
  school_name: string;
  priority: string;
  status: string;
  url: string;
  summary: string | null;
  old_excerpt: string | null;
  new_excerpt: string | null;
  detected_at: string;
};

export default async function MedicalSchoolUpdatesPage() {
  const supabase = createAdminClient();

  const { data: updates, error } = await supabase
    .from("medical_school_updates")
    .select("*")
    .order("detected_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold">Medical School Updates</h1>
        <p className="mt-4 text-sm text-red-600">
          Failed to load updates: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Medical School Updates</h1>

      {!updates?.length ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            No detected updates yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {(updates as MedicalSchoolUpdate[]).map((update) => (
            <div
              key={update.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-lg font-semibold">{update.school_name}</div>

                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                  {update.priority}
                </div>

                <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  {update.status}
                </div>
              </div>

              <p className="mt-2 break-all text-sm text-slate-500">{update.url}</p>

              <p className="mt-3 text-sm font-medium text-slate-700">
                {update.summary || "No summary"}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Detected: {new Date(update.detected_at).toLocaleString()}
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Old excerpt
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {update.old_excerpt || "No previous excerpt"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    New excerpt
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {update.new_excerpt || "No new excerpt"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}