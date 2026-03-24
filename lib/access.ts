export type SubscriptionPlan = "free" | "pro_monthly" | "pro_annual" | null;

export type SubscriptionStatus =
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
  currentPeriodEnd?: string | Date | null
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
    subscription?.current_period_end ?? null
  );
}

export function getCurrentPlan(
  plan: SubscriptionPlan,
  status: SubscriptionStatus,
  currentPeriodEnd?: string | Date | null
): "free" | "pro_monthly" | "pro_annual" {
  if (plan === "pro_monthly") {
    if (status === "active" || status === "trialing") {
      return "pro_monthly";
    }

    if (status === "canceled" && currentPeriodEnd) {
      const end = new Date(currentPeriodEnd);
      if (end.getTime() > Date.now()) {
        return "pro_monthly";
      }
    }
  }

  if (plan === "pro_annual") {
    if (status === "active" || status === "trialing") {
      return "pro_annual";
    }

    if (status === "canceled" && currentPeriodEnd) {
      const end = new Date(currentPeriodEnd);
      if (end.getTime() > Date.now()) {
        return "pro_annual";
      }
    }
  }

  return "free";
}

export function getCurrentPlanFromSubscription(
  subscription: SubscriptionLike | null | undefined
): "free" | "pro_monthly" | "pro_annual" {
  return getCurrentPlan(
    subscription?.plan ?? null,
    subscription?.status ?? null,
    subscription?.current_period_end ?? null
  );
}