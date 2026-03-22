import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { hasPremiumAccessFromSubscription } from "@/lib/access";

type RequirePremiumOptions = {
  signInRedirect?: string;
  upgradeRedirect?: string;
};

export async function requirePremiumAccess(
  options: RequirePremiumOptions = {}
) {
  const signInRedirect = options.signInRedirect ?? "/sign-in";
  const upgradeRedirect = options.upgradeRedirect ?? "/pricing";

  const { userId } = await auth();

  if (!userId) {
    redirect(signInRedirect);
  }

  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end, cancel_at_period_end")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching subscription:", error);
    redirect(upgradeRedirect);
  }

  const isPremium = hasPremiumAccessFromSubscription(subscription);

  if (!isPremium) {
    redirect(upgradeRedirect);
  }

  return {
    userId,
    subscription,
    isPremium,
  };
}