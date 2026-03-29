import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import {
  buildArenaSession,
  getBossById,
  isBossUnlocked,
  type ArenaBossId,
} from "@/app/(marketing)/tools/train/_lib/interview-arena";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type StartArenaBody = {
  bossId: ArenaBossId;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as StartArenaBody;

    if (!body?.bossId) {
      return NextResponse.json({ error: "bossId is required." }, { status: 400 });
    }

    const boss = getBossById(body.bossId);

    if (!boss) {
      return NextResponse.json({ error: "Invalid boss." }, { status: 400 });
    }

    const { data: progress, error: progressError } = await supabase
      .from("command_progress")
      .select("vitals_total, momentum_state, boss_level_unlocked")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (progressError) {
      return NextResponse.json(
        { error: progressError.message || "Failed to load command progress." },
        { status: 500 }
      );
    }

    const vitalsTotal = progress?.vitals_total ?? 0;
    const momentumState = progress?.momentum_state ?? "cold";

    const unlocked = isBossUnlocked({
      boss,
      vitalsTotal,
      momentumState,
    });

    if (!unlocked) {
      return NextResponse.json(
        {
          error: "Boss is locked.",
          unlockVitals: boss.unlockVitals,
          requiresMomentum: boss.requiresMomentum ?? null,
        },
        { status: 403 }
      );
    }

    const session = buildArenaSession(boss);

    const { data: arenaRun, error: arenaError } = await supabase
      .from("arena_runs")
      .insert({
        clerk_user_id: userId,
        boss_level: boss.level,
        boss_name: boss.title,
        mode: boss.mode,
        prompt: JSON.stringify(session.questions),
        result: "in_progress",
        vitals_awarded: 0,
        timer_seconds: boss.timeLimitSeconds,
      })
      .select("id, started_at")
      .single();

    if (arenaError || !arenaRun) {
      return NextResponse.json(
        { error: arenaError?.message || "Failed to start arena run." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      runId: arenaRun.id,
      startedAt: arenaRun.started_at,
      session,
      boss: {
        id: boss.id,
        level: boss.level,
        title: boss.title,
        name: boss.name,
        mode: boss.mode,
        timeLimitSeconds: boss.timeLimitSeconds,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}