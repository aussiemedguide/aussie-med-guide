import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";
import ScholarshipsClient from "./scholarships-client";

export default async function ScholarshipsPage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/resources/scholarships",
  });

  const { isPremium } = await getUserAccess(userId);

  return <ScholarshipsClient isPremium={isPremium} />;
}