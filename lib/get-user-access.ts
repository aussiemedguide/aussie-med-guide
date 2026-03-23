import { unstable_noStore as noStore } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasPremiumAccessFromSubscription } from "@/lib/access";

export async function getUserAccess(clerkUserId: string) {
  noStore();

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

  const isPremium = hasPremiumAccessFromSubscription(subscription);

  console.log("GET_USER_ACCESS", {
    clerkUserId,
    subscription,
    isPremium,
  });

  return {
    subscription,
    isPremium,
  };
}