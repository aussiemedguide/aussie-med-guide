export function hasPremiumAccess(
  plan?: string | null,
  status?: string | null
): boolean {
  if (!plan || plan === "free") return false;

  return status === "active" || status === "trialing";
}