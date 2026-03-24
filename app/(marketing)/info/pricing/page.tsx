import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentPlanFromSubscription } from "@/lib/access";
import PricingClient from "./pricing-client";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function PricingPage() {
  const { userId } = await auth();

  let currentPlan: "free" | "pro_monthly" | "pro_annual" = "free";

  if (userId) {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select(
        "plan, status, current_period_end, cancel_at_period_end, created_at"
      )
      .eq("clerk_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Failed to fetch subscription:", error);
    }

    const subscription = subscriptions?.[0] ?? null;

    console.log("PRICING subscription row:", subscription);

    currentPlan = getCurrentPlanFromSubscription(subscription);

    console.log("PRICING computed currentPlan:", currentPlan);
  }

  return <PricingClient currentPlan={currentPlan} />;
}