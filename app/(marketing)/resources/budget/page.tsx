import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasPremiumAccess } from "@/lib/access";
import BudgetClient from "./budget-client";

export default async function BudgetPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔐 force login first
  if (!user) {
    redirect("/auth/login?next=/resources/budget");
  }

  // 🔐 check subscription
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const isPremium = hasPremiumAccess(profile?.plan);

  return <BudgetClient isPremium={isPremium} />;
}