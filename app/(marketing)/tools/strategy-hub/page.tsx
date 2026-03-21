import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { hasPremiumAccess } from "@/lib/access";
import StrategyHubClient from "./strategy-hub.client";

export default async function StrategyHubPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/tools/strategy-hub");
  }

  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("user_subscriptions")
    .select("plan, subscription_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch subscription for strategy hub page:", error);
  }

  const isPremium = hasPremiumAccess(
    subscription?.plan ?? null,
    subscription?.subscription_status ?? null
  );

  return <StrategyHubClient isPremium={isPremium} />;
}