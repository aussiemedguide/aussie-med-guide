import { createAdminClient } from "@/lib/supabase/admin";
import { fetchPage } from "@/lib/medical-schools/fetch-page";
import { normalizePage } from "@/lib/medical-schools/normalize-page";
import { sha256 } from "@/lib/medical-schools/hash";
import { detectChanges } from "@/lib/medical-schools/detect-change";

type MedicalSchoolSourceRow = {
  id: number;
  school_slug: string;
  school_name: string;
  source_type: string;
  url: string;
  is_active: boolean;
  check_frequency_hours: number | null;
  last_checked_at: string | null;
};

function shouldCheckSource(
  lastCheckedAt: string | null,
  checkFrequencyHours: number | null
) {
  if (!lastCheckedAt) return true;

  const hours = checkFrequencyHours ?? 24;
  const last = new Date(lastCheckedAt).getTime();
  const now = Date.now();

  return now - last >= hours * 60 * 60 * 1000;
}

export async function runMedicalSchoolChecker() {
  const supabase = createAdminClient();

  const { data: sources, error: sourcesError } = await supabase
    .from("medical_school_sources")
    .select(
      "id, school_slug, school_name, source_type, url, is_active, check_frequency_hours, last_checked_at"
    )
    .eq("is_active", true);

  if (sourcesError) {
    throw new Error(`Failed to load sources: ${sourcesError.message}`);
  }

  let checked = 0;
  let changed = 0;
  let failed = 0;
  let skipped = 0;

  const errors: Array<{
    sourceId: number;
    url: string;
    step: string;
    message: string;
  }> = [];

  for (const source of (sources ?? []) as MedicalSchoolSourceRow[]) {
    // TEMP DEBUG MODE:
    // force checks every time until this is fully working.
    // Later, change this back to:
    // const shouldCheck = shouldCheckSource(
    //   source.last_checked_at,
    //   source.check_frequency_hours
    // );
    const shouldCheck = shouldCheckSource(
       source.last_checked_at,
      source.check_frequency_hours
    );
    if (!shouldCheck) {
      skipped += 1;
      continue;
    }

    const checkedAt = new Date().toISOString();

    try {
      console.log("Checking source:", source.id, source.url);

      const fetched = await fetchPage(source.url);

      console.log("Fetched source:", {
        sourceId: source.id,
        status: fetched.status,
        finalUrl: fetched.finalUrl,
        contentType: fetched.contentType,
        htmlLength: fetched.html.length,
      });

      if (fetched.status >= 400 || !fetched.html) {
        await supabase
          .from("medical_school_sources")
          .update({
            last_checked_at: checkedAt,
          })
          .eq("id", source.id);

        failed += 1;
        errors.push({
          sourceId: source.id,
          url: source.url,
          step: "fetch",
          message: `Fetch failed with status ${fetched.status}`,
        });
        continue;
      }

      const normalized = normalizePage(fetched.html);
      const newHash = sha256(normalized.normalizedText);

      console.log("Normalized source:", {
        sourceId: source.id,
        title: normalized.title,
        textLength: normalized.textLength,
        excerptLength: normalized.excerpt.length,
      });

      const { data: latestSnapshot, error: snapshotError } = await supabase
        .from("medical_school_snapshots")
        .select("id, content_hash, normalized_json")
        .eq("source_id", source.id)
        .order("fetched_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (snapshotError) {
        throw new Error(`Snapshot lookup failed: ${snapshotError.message}`);
      }

      const oldHash = latestSnapshot?.content_hash ?? null;
      const oldText =
        latestSnapshot?.normalized_json?.normalizedText ??
        latestSnapshot?.normalized_json?.normalized_text ??
        null;

      const change = detectChanges({
        oldHash,
        newHash,
        oldText,
        newText: normalized.normalizedText,
      });

      const snapshotPayload = {
        source_id: source.id,
        fetched_at: checkedAt,
        content_hash: newHash,
        raw_text: fetched.html,
        normalized_json: {
          title: normalized.title,
          normalizedText: normalized.normalizedText,
          excerpt: normalized.excerpt,
          textLength: normalized.textLength,
          finalUrl: fetched.finalUrl,
          status: fetched.status,
          contentType: fetched.contentType,
        },
      };

      console.log("Inserting snapshot:", {
        sourceId: source.id,
        fetched_at: snapshotPayload.fetched_at,
        content_hash: snapshotPayload.content_hash,
      });

      const { error: insertSnapshotError } = await supabase
        .from("medical_school_snapshots")
        .insert(snapshotPayload);

      if (insertSnapshotError) {
        throw new Error(`Snapshot insert failed: ${insertSnapshotError.message}`);
      }

      const sourceUpdatePayload: Record<string, unknown> = {
        last_checked_at: checkedAt,
        last_success_at: checkedAt,
        last_hash: newHash,
      };

      if (change.changed) {
        sourceUpdatePayload.last_changed_at = checkedAt;
      }

      const { error: updateSourceError } = await supabase
        .from("medical_school_sources")
        .update(sourceUpdatePayload)
        .eq("id", source.id);

      if (updateSourceError) {
        throw new Error(`Source update failed: ${updateSourceError.message}`);
      }

      if (change.changed) {
        const { data: existing, error: existingError } = await supabase
          .from("medical_school_updates")
          .select("id")
          .eq("url", source.url)
          .eq("new_hash", newHash)
          .limit(1)
          .maybeSingle();

        if (existingError) {
          throw new Error(`Existing update lookup failed: ${existingError.message}`);
        }

        if (!existing) {
          const { error: insertUpdateError } = await supabase
            .from("medical_school_updates")
            .insert({
              school_slug: source.school_slug,
              school_name: source.school_name,
              source_id: source.id,
              url: source.url,
              change_type: "content_changed",
              summary: change.summary,
              old_hash: change.oldHash,
              new_hash: change.newHash,
              old_excerpt: change.oldExcerpt,
              new_excerpt: change.newExcerpt,
              priority: change.priority,
              status: "detected",
              detected_at: checkedAt,
            });

          if (insertUpdateError) {
            throw new Error(`Update insert failed: ${insertUpdateError.message}`);
          }

          changed += 1;
        }
      }

      checked += 1;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown checker error";

      console.error("Medical school checker error:", {
        sourceId: source.id,
        url: source.url,
        message,
      });

      await supabase
        .from("medical_school_sources")
        .update({
          last_checked_at: checkedAt,
        })
        .eq("id", source.id);

      failed += 1;

      errors.push({
        sourceId: source.id,
        url: source.url,
        step: "unknown",
        message,
      });
    }
  }

  return {
    checked,
    changed,
    failed,
    skipped,
    errors,
  };
}