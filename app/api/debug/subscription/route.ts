import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  return NextResponse.json({
    clerkUserId: userId,
    subscription,
    error,
  });
}