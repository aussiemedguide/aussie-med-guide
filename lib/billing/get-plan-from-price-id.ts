export type AppPlan = "free" | "pro_monthly" | "pro_annual";

export function getPlanFromPriceId(priceId?: string | null): AppPlan {
  if (!priceId) return "free";

  if (priceId === process.env.STRIPE_PRO_MONTHLY) {
    return "pro_monthly";
  }

  if (priceId === process.env.STRIPE_PRO_ANNUAL) {
    return "pro_annual";
  }

  return "free";
}