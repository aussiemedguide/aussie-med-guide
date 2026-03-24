import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentPlanFromSubscription } from "@/lib/access";
import PricingClient from "./pricing-client";

export default async function PricingPage() {
  const { userId } = await auth();

  let currentPlan: "free" | "pro_monthly" | "pro_annual" = "free";

  if (userId) {
    const supabase = await createClient();

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("plan, status, current_period_end, cancel_at_period_end")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch subscription:", error);
    }

    currentPlan = getCurrentPlanFromSubscription(subscription);
  }

  return <PricingClient currentPlan={currentPlan} />;
}