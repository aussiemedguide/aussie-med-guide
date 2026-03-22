import { createAdminClient } from "@/lib/supabase/admin";
import { hasPremiumAccessFromSubscription } from "@/lib/access";

export async function getUserAccess(clerkUserId: string) {
  const supabase = createAdminClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end, cancel_at_period_end")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching subscription:", error);

    return {
      subscription: null,
      isPremium: false,
    };
  }

  return {
    subscription,
    isPremium: hasPremiumAccessFromSubscription(subscription),
  };
}