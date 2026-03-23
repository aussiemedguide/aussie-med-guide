import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";
import ResilienceClient from "./resilience-client";

export const dynamic = "force-dynamic";

export default async function ResiliencePage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/tools/resilience",
  });

  const access = await getUserAccess(userId);

  console.log("RESILIENCE PAGE ACCESS", access);

  return <ResilienceClient isPremium={access.isPremium} />;
}