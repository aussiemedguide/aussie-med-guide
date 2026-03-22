import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";
import StrategyHubClient from "./strategy-hub.client";

export default async function StrategyHubPage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/tools/strategy-hub",
  });

  const { isPremium } = await getUserAccess(userId);

  return <StrategyHubClient isPremium={isPremium} />;
}