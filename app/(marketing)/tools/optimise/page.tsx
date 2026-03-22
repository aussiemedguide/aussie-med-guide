import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";
import OptimiseClient from "./optimise-client";

export default async function OptimisePage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/tools/optimise",
  });

  const { isPremium } = await getUserAccess(userId);

  return <OptimiseClient isPremium={isPremium} />;
}