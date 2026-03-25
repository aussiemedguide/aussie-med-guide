import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type AwardRequestBody = {
  source:
    | "profile_save"
    | "custom_date_add"
    | "interview_attempt"
    | "arena_win"
    | "arena_completion"
    | "mission_bonus"
    | "manual_adjustment"
    | "consistency_decay";
  delta: number;
  reason: string;
  metadata?: Record<string, unknown>;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as AwardRequestBody;

    if (!body?.source || typeof body.delta !== "number" || !body.reason) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { error } = await supabase.rpc("award_vitals", {
      p_clerk_user_id: userId,
      p_source: body.source,
      p_delta: body.delta,
      p_reason: body.reason,
      p_metadata: body.metadata ?? {},
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to award vitals." },
        { status: 500 }
      );
    }

    const { data: progress, error: progressError } = await supabase
      .from("command_progress")
      .select(
        "clerk_user_id, vitals_total, vitals_today, momentum_state, active_days_this_week, boss_level_unlocked, last_activity_at, created_at, updated_at"
      )
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (progressError) {
      return NextResponse.json(
        { error: progressError.message || "Vitals awarded but progress refresh failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
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
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}