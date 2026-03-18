export function hasPremiumAccess(status: string | null | undefined) {
  return status === "active" || status === "trialing";
}