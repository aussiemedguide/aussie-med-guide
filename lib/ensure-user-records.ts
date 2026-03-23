import { createAdminClient } from "@/lib/supabase/admin";

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
  const supabase = createAdminClient();

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      clerk_user_id: clerkUserId,
      email: email ?? null,
      full_name: fullName ?? null,
      display_name: fullName ?? null,
      onboarding_completed: false,
      accepted_disclaimer: false,
    },
    {
      onConflict: "clerk_user_id",
      ignoreDuplicates: false,
    }
  );

  if (profileError) {
    console.error("Failed upserting profile record:", profileError);
    throw new Error(`Failed upserting profile record: ${profileError.message}`);
  }

  const { data: existingSubscription, error: existingSubscriptionError } =
    await supabase
      .from("subscriptions")
      .select("clerk_user_id")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

  if (existingSubscriptionError) {
    console.error(
      "Failed checking existing subscription record:",
      existingSubscriptionError
    );
    throw new Error(
      `Failed checking existing subscription record: ${existingSubscriptionError.message}`
    );
  }

  if (!existingSubscription) {
    const { error: subscriptionError } = await supabase
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

    if (subscriptionError) {
      console.error("Failed inserting subscription record:", subscriptionError);
      throw new Error(
        `Failed inserting subscription record: ${subscriptionError.message}`
      );
    }
  }
}