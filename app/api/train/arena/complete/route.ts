import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import {
  getBossByLevel,
  scoreArenaResponse,
} from "@/app/(marketing)/tools/train/_lib/interview-arena";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type CompleteArenaBody = {
  runId: number;
  response: string;
  title?: string;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as CompleteArenaBody;

    if (!body?.runId || !body?.response?.trim()) {
      return NextResponse.json(
        { error: "runId and response are required." },
        { status: 400 }
      );
    }

    const { data: run, error: runError } = await supabase
      .from("arena_runs")
      .select("*")
      .eq("id", body.runId)
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (runError || !run) {
      return NextResponse.json(
        { error: runError?.message || "Arena run not found." },
        { status: 404 }
      );
    }

    if (run.result === "completed" || run.completed_at) {
      return NextResponse.json(
        { error: "This arena run has already been completed." },
        { status: 409 }
      );
    }

    const boss = getBossByLevel(run.boss_level);

    if (!boss) {
      return NextResponse.json(
        { error: "Boss config not found." },
        { status: 400 }
      );
    }

    const scored = scoreArenaResponse({
      response: body.response.trim(),
      boss,
    });

    const vitalsAwarded = scored.pass ? boss.rewardVitals : 20;

    const { error: updateArenaError } = await supabase
      .from("arena_runs")
      .update({
        response: body.response.trim(),
        result: scored.result,
        vitals_awarded: vitalsAwarded,
        score_overall: scored.breakdown.overall,
        score_clarity: scored.breakdown.clarity,
        score_reasoning: scored.breakdown.reasoning,
        score_empathy: scored.breakdown.empathy,
        score_structure: scored.breakdown.structure,
        score_professionalism: scored.breakdown.professionalism,
        feedback: scored.feedback,
        completed_at: new Date().toISOString(),
      })
      .eq("id", body.runId)
      .eq("clerk_user_id", userId);

    if (updateArenaError) {
      return NextResponse.json(
        { error: updateArenaError.message || "Failed to complete arena run." },
        { status: 500 }
      );
    }

    const promptForAttempt =
      typeof run.prompt === "string" ? run.prompt : JSON.stringify(run.prompt);

    const { error: attemptError } = await supabase
      .from("interview_attempts")
      .insert({
        clerk_user_id: userId,
        mode: boss.mode.toUpperCase(),
        title: body.title?.trim() || `${boss.title} Arena Run`,
        prompt: promptForAttempt,
        response: body.response.trim(),
        clarity: scored.breakdown.clarity,
        reasoning: scored.breakdown.reasoning,
        empathy: scored.breakdown.empathy,
        structure: scored.breakdown.structure,
        professionalism: scored.breakdown.professionalism,
        overall: scored.breakdown.overall,
        feedback: scored.feedback,
        improvements: {
          bossLevel: boss.level,
          bossName: boss.title,
          pass: scored.pass,
          arena: true,
        },
      });

    if (attemptError) {
      return NextResponse.json(
        {
          error:
            attemptError.message ||
            "Arena run completed but interview attempt failed to save.",
        },
        { status: 500 }
      );
    }

    const { error: awardError } = await supabase.rpc("award_vitals", {
      p_clerk_user_id: userId,
      p_source: scored.pass ? "arena_win" : "arena_completion",
      p_delta: vitalsAwarded,
      p_reason: scored.pass
        ? `Beat ${boss.title}`
        : `Completed ${boss.title}`,
      p_source_id: String(body.runId),
      p_metadata: {
        runId: body.runId,
        bossLevel: boss.level,
        bossName: boss.title,
        pass: scored.pass,
      },
    });

    if (awardError) {
      return NextResponse.json(
        {
          error:
            awardError.message || "Arena run scored but vitals awarding failed.",
        },
        { status: 500 }
      );
    }

    const { data: updatedProgress } = await supabase
      .from("command_progress")
      .select(
        "clerk_user_id, vitals_total, vitals_today, momentum_state, active_days_this_week, boss_level_unlocked, last_activity_at, created_at, updated_at"
      )
      .eq("clerk_user_id", userId)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      result: scored.result,
      pass: scored.pass,
      feedback: scored.feedback,
      vitalsAwarded,
      breakdown: scored.breakdown,
      updatedProgress: updatedProgress ?? null,
      boss: {
        level: boss.level,
        title: boss.title,
        name: boss.name,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}