import { createClient } from "@/lib/supabase/server";

type EnsureUserRecordsParams = {
  clerkUserId: string;
  email?: string | null;
  fullName?: string | null;
};

export async function ensureUserRecords({
  clerkUserId,
  email,
  fullName,
}: EnsureUserRecordsParams) {
  const supabase = await createClient();

  const [profileRes, subscriptionRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("clerk_user_id")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("clerk_user_id")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle(),
  ]);

  if (profileRes.error) {
    console.error("Failed checking profile record:", profileRes.error);
    throw new Error("Failed checking profile record");
  }

  if (subscriptionRes.error) {
    console.error("Failed checking subscription record:", subscriptionRes.error);
    throw new Error("Failed checking subscription record");
  }

  if (!profileRes.data) {
    const { error: insertProfileError } = await supabase.from("profiles").insert({
      clerk_user_id: clerkUserId,
      email: email ?? null,
      full_name: fullName ?? null,
      display_name: fullName ?? null,
      onboarding_completed: false,
      accepted_disclaimer: false,
    });

    if (insertProfileError) {
      console.error("Failed creating profile record:", insertProfileError);
      throw new Error("Failed creating profile record");
    }
  }

  if (!subscriptionRes.data) {
    const { error: insertSubscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        clerk_user_id: clerkUserId,
        plan: "free",
        status: "free",
        stripe_customer_id: null,
        stripe_subscription_id: null,
        stripe_price_id: null,
        cancel_at_period_end: false,
        current_period_end: null,
      });

    if (insertSubscriptionError) {
      console.error(
        "Failed creating subscription record:",
        insertSubscriptionError
      );
      throw new Error("Failed creating subscription record");
    }
  }
}