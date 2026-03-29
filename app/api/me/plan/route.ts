import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hasPremiumAccess(status: string | null | undefined, plan: string | null | undefined) {
  return (
    status === "active" ||
    status === "trialing" ||
    plan === "pro" ||
    plan === "monthly" ||
    plan === "annual" ||
    plan === "premium"
  );
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({
      isSignedIn: false,
      isPro: false,
      plan: "free",
      status: null,
    });
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("PLAN ROUTE ERROR:", error);

    return NextResponse.json({
      isSignedIn: true,
      isPro: false,
      plan: "free",
      status: null,
      error: error.message,
    });
  }

  const status =
    data?.subscription_status ??
    data?.status ??
    null;

  const plan =
    data?.plan ??
    data?.subscription_plan ??
    "free";

  const isPro = hasPremiumAccess(status, plan);

  return NextResponse.json({
    isSignedIn: true,
    isPro,
    plan,
    status,
    debugRow: data,
  });
}