import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasPremiumAccess } from "@/lib/access";
import OptimiseClient from "./strategy-hub.client";

export default async function StrategyHubPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/tools/strategy-hub");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const isPremium = hasPremiumAccess(profile?.plan);

  return <OptimiseClient isPremium={isPremium} />;
}