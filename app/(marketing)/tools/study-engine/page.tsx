import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasPremiumAccess } from "@/lib/access";
import OptimiseClient from "./study-engine.client";

export default async function StudyEnginePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/tools/study-engine");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const isPremium = hasPremiumAccess(profile?.plan);

  return <OptimiseClient isPremium={isPremium} />;
}