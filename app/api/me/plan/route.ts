import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hasPremiumAccess(status: string | null | undefined) {
  return status === "active" || status === "trialing";
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { isSignedIn: false, isPro: false, plan: "free", status: null },
      { status: 200 }
    );
  }

  const { data, error } = await supabase
    .from("user_subscriptions") // change to "subscriptions" if that is your real table name
    .select("plan, subscription_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        isSignedIn: true,
        isPro: false,
        plan: "free",
        status: null,
        error: error.message,
      },
      { status: 200 }
    );
  }

  const status = data?.subscription_status ?? null;
  const plan = data?.plan ?? "free";
  const isPro = hasPremiumAccess(status);

  return NextResponse.json({
    isSignedIn: true,
    isPro,
    plan,
    status,
  });
}