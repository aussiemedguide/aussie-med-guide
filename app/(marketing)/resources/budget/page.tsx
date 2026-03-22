import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";
import BudgetClient from "./budget-client";

export default async function BudgetPage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/resources/budget",
  });

  const { isPremium } = await getUserAccess(userId);

  return <BudgetClient isPremium={isPremium} />;
}