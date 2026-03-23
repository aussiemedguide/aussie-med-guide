import { createAdminClient } from "@/lib/supabase/admin";
import { fetchPage } from "@/lib/medical-schools/fetch-page";
import { normalizePage } from "@/lib/medical-schools/normalize-page";
import { sha256 } from "@/lib/medical-schools/hash";
import { detectChanges } from "@/lib/medical-schools/detect-change";

export async function runMedicalSchoolChecker() {
  const supabase = createAdminClient();

  const { data: sources, error: sourcesError } = await supabase
    .from("medical_school_sources")
    .select("*")
    .eq("is_active", true);

  if (sourcesError) {
    throw new Error(`Failed to load sources: ${sourcesError.message}`);
  }

  let checked = 0;
  let changed = 0;
  let failed = 0;

  for (const source of sources ?? []) {
    try {
      const fetched = await fetchPage(source.url);

      if (fetched.status >= 400) {
        await supabase
          .from("medical_school_sources")
          .update({
            last_checked_at: new Date().toISOString(),
            last_error: `HTTP ${fetched.status}`,
          })
          .eq("id", source.id);

        failed += 1;
        continue;
      }

      const normalized = normalizePage(fetched.html);
      const newHash = sha256(normalized.normalizedText);

      const { data: latestSnapshot } = await supabase
        .from("medical_school_page_snapshots")
        .select("*")
        .eq("source_id", source.id)
        .order("checked_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const oldHash = latestSnapshot?.content_hash ?? null;
      const oldText = latestSnapshot?.normalized_text ?? null;

      const change = detectChanges({
        oldHash,
        newHash,
        oldText,
        newText: normalized.normalizedText,
      });

      await supabase.from("medical_school_page_snapshots").insert({
        source_id: source.id,
        source_url: source.url,
        content_hash: newHash,
        normalized_text: normalized.normalizedText,
        page_title: normalized.title,
      });

      await supabase
        .from("medical_school_sources")
        .update({
          current_hash: newHash,
          last_checked_at: new Date().toISOString(),
          last_success_at: new Date().toISOString(),
          last_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", source.id);

      if (change.changed) {
        const { data: existing } = await supabase
          .from("medical_school_updates")
          .select("id")
          .eq("url", source.url)
          .eq("new_hash", newHash)
          .limit(1)
          .maybeSingle();

        if (!existing) {
          await supabase.from("medical_school_updates").insert({
            school_slug: source.school_slug,
            school_name: source.school_name,
            source_id: source.id,
            source_type: source.source_type,
            url: source.url,
            change_type: "content_changed",
            summary: change.summary,
            old_hash: change.oldHash,
            new_hash: change.newHash,
            old_excerpt: change.oldExcerpt,
            new_excerpt: change.newExcerpt,
            priority: change.priority,
            status: "detected",
          });

          changed += 1;
        }
      }

      checked += 1;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown checker error";

      await supabase
        .from("medical_school_sources")
        .update({
          last_checked_at: new Date().toISOString(),
          last_error: message,
        })
        .eq("id", source.id);

      failed += 1;
    }
  }

  return {
    checked,
    changed,
    failed,
  };
}