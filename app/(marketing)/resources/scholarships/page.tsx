import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { hasPremiumAccess } from "@/lib/access";
import ScholarshipsClient from "./scholarships-client";

export default async function ScholarshipsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/resources/scholarships");
  }

  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("plan, subscription_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  const isPremium =
    subscription?.subscription_status === "active" &&
    hasPremiumAccess(subscription?.plan);

  return <ScholarshipsClient isPremium={isPremium} />;
}