export type SubscriptionPlan = "free" | "pro_monthly" | "pro_annual" | null;

export type SubscriptionStatus =
  | "free"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | null;

export type SubscriptionLike = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_end?: string | Date | null;
  cancel_at_period_end?: boolean | null;
};

export function hasPremiumAccess(
  plan: SubscriptionPlan,
  status: SubscriptionStatus,
  currentPeriodEnd?: string | Date | null,
  cancelAtPeriodEnd?: boolean | null
) {
  if (plan !== "pro_monthly" && plan !== "pro_annual") {
    return false;
  }

  if (status === "active" || status === "trialing") {
    return true;
  }

  if (status === "canceled" && currentPeriodEnd) {
    const end = new Date(currentPeriodEnd);
    return end.getTime() > Date.now();
  }

  return false;
}

export function hasPremiumAccessFromSubscription(
  subscription: SubscriptionLike | null | undefined
) {
  return hasPremiumAccess(
    subscription?.plan ?? null,
    subscription?.status ?? null,
    subscription?.current_period_end ?? null,
    subscription?.cancel_at_period_end ?? null
  );
}