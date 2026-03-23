import { createAdminClient } from "@/lib/supabase/admin";

export async function applyApprovedUpdate(updateId: number) {
  const supabase = createAdminClient();

  const { data: update, error } = await supabase
    .from("medical_school_updates")
    .select("*")
    .eq("id", updateId)
    .maybeSingle();

  if (error || !update) {
    throw new Error("Update not found");
  }

  const { error: updateError } = await supabase
    .from("medical_school_updates")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", updateId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { data: profile, error: profileError } = await supabase
    .from("medical_school_profiles")
    .select("latest_verified_updates")
    .eq("school_slug", update.school_slug)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const current = Array.isArray(profile?.latest_verified_updates)
    ? profile.latest_verified_updates
    : [];

  const next = [
    {
      id: update.id,
      summary: update.summary,
      detected_at: update.detected_at,
      priority: update.priority,
      url: update.url,
    },
    ...current,
  ].slice(0, 8);

  const { error: profileUpdateError } = await supabase
    .from("medical_school_profiles")
    .update({
      latest_verified_updates: next,
      updated_at: new Date().toISOString(),
    })
    .eq("school_slug", update.school_slug);

  if (profileUpdateError) {
    throw new Error(profileUpdateError.message);
  }
}