import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";
import TrainClient from "./train-client";

export default async function TrainPage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/tools/train",
  });

  const { isPremium } = await getUserAccess(userId);

  return <TrainClient isPremium={isPremium} userId={userId} />;
}