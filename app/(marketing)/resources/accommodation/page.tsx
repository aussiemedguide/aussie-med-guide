import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";
import AccommodationsClient from "./accommodations-client";

export default async function AccommodationPage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/resources/accommodation",
  });

  const { isPremium } = await getUserAccess(userId);

  return <AccommodationsClient isPremium={isPremium} />;
}