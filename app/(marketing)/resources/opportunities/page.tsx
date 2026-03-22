import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";
import OpportunitiesClient from "./opportunities-client";

export default async function OpportunitiesPage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/resources/opportunities",
  });

  const { isPremium } = await getUserAccess(userId);

  return <OpportunitiesClient isPremium={isPremium} />;
}