import { createAdminClient } from "@/lib/supabase/admin";
import { medicalSchoolSources } from "@/data/medical-school-sources";

export async function syncMedicalSchoolSources() {
  const supabase = createAdminClient();

  const rows = medicalSchoolSources.map((source) => ({
    school_slug: source.schoolSlug,
    school_name: source.schoolName,
    source_type: source.sourceType,
    url: source.url,
    check_frequency_hours: source.checkFrequencyHours,
    is_active: true,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("medical_school_sources")
    .upsert(rows, { onConflict: "url" });

  if (error) {
    throw new Error(`Failed to sync medical school sources: ${error.message}`);
  }

  return { count: rows.length };
}