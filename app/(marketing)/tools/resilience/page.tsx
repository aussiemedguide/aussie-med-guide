import { requireAuth } from "@/lib/require-auth";
import ResilienceClient from "./resilience-client";

export default async function ResiliencePage() {
  await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/tools/resilience",
  });

  return <ResilienceClient isPremium={true} />;
}