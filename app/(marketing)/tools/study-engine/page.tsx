import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";
import StudyEngineClient from "./study-engine.client";

export default async function StudyEnginePage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/tools/study-engine",
  });

  const { isPremium } = await getUserAccess(userId);

  return <StudyEngineClient isPremium={isPremium} />;
}