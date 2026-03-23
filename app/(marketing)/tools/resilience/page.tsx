export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";
import ResilienceClient from "./resilience-client";

export default async function ResiliencePage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/tools/resilience",
  });

  const { isPremium } = await getUserAccess(userId);

  return <ResilienceClient isPremium={isPremium} />;
}