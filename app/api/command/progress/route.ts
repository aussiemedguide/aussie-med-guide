import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [{ data: progress, error: progressError }, { data: events, error: eventsError }] =
      await Promise.all([
        supabase
          .from("command_progress")
          .select(
            "clerk_user_id, vitals_total, vitals_today, momentum_state, active_days_this_week, boss_level_unlocked, last_activity_at, created_at, updated_at"
          )
          .eq("clerk_user_id", userId)
          .maybeSingle(),
        supabase
          .from("vitals_events")
          .select("id, source, reason, metadata, occurred_at, created_at")
          .eq("clerk_user_id", userId)
          .order("occurred_at", { ascending: false })
          .limit(20),
      ]);

    if (progressError) {
      return NextResponse.json(
        { error: progressError.message || "Failed to load command progress." },
        { status: 500 }
      );
    }

    if (eventsError) {
      return NextResponse.json(
        { error: eventsError.message || "Failed to load vitals history." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      progress:
        progress ?? {
          clerk_user_id: userId,
          vitals_total: 0,
          vitals_today: 0,
          momentum_state: "cold",
          active_days_this_week: 0,
          boss_level_unlocked: 1,
          last_activity_at: null,
          created_at: null,
          updated_at: null,
        },
      events: events ?? [],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}