import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { hasPremiumAccess } from "@/lib/access";
import OpportunitiesClient from "./opportunities-client";

export default async function OpportunitiesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/resources/opportunities");
  }

  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("user_subscriptions")
    .select("plan, subscription_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch subscription for opportunities page:", error);
  }

  const isPremium = hasPremiumAccess(
    subscription?.plan ?? null,
    subscription?.subscription_status ?? null
  );

  return <OpportunitiesClient isPremium={isPremium} />;
}