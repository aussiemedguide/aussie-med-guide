import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ensureUserRecords } from "@/lib/ensure-user-records";

type RequireAuthOptions = {
  signInRedirect?: string;
};

export async function requireAuth(options: RequireAuthOptions = {}) {
  const signInRedirect =
    options.signInRedirect ?? "/sign-in?redirect_url=/tools/command";

  const { userId } = await auth();

  if (!userId) {
    redirect(signInRedirect);
  }

  const user = await currentUser();

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    null;

  const fullName = user?.fullName || user?.firstName || null;

  await ensureUserRecords({
    clerkUserId: userId,
    email,
    fullName,
  });

  return { userId };
}