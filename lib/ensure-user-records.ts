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

  const { error: subscriptionError } = await supabase
    .from("subscriptions")
    .upsert(
      {
        clerk_user_id: clerkUserId,
        plan: "free",
        status: "free",
        stripe_customer_id: null,
        stripe_subscription_id: null,
        stripe_price_id: null,
        cancel_at_period_end: false,
        current_period_end: null,
      },
      {
        onConflict: "clerk_user_id",
        ignoreDuplicates: false,
      }
    );

  if (subscriptionError) {
    console.error("Failed upserting subscription record:", subscriptionError);
    throw new Error(
      `Failed upserting subscription record: ${subscriptionError.message}`
    );
  }
}