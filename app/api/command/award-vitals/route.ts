import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { VITALS_REWARDS, getMomentumState } from "@/lib/command-progress";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type AwardSource =
  | "interview_session"
  | "feedback_review"
  | "custom_date"
  | "profile_update"
  | "target_university"
  | "roadmap_checkpoint"
  | "scholarship_tracker"
  | "experience_entry"
  | "boss_battle_tier_1"
  | "boss_battle_tier_2"
  | "boss_battle_tier_3"
  | "boss_battle_tier_4"
  | "boss_battle_tier_5";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const source = body?.source as AwardSource | undefined;
    const label = body?.label as string | undefined;
    const sourceId = body?.sourceId as string | undefined;

    if (!source || !label) {
      return NextResponse.json({ error: "Missing source or label" }, { status: 400 });
    }

    const vitals = VITALS_REWARDS[source];
    if (!vitals) {
      return NextResponse.json({ error: "Invalid source" }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);

    const { data: existing } = await supabase
      .from("command_progress")
      .select("*")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    let progress = existing;

    if (!progress) {
      const { data: inserted, error: insertError } = await supabase
        .from("command_progress")
        .insert({
          clerk_user_id: userId,
          vitals_total: 0,
          vitals_today: 0,
          vitals_today_date: today,
          momentum_state: "warming_up",
          active_days_this_week: 0,
          weekly_goal: 5,
          boss_level_unlocked: 1,
          boss_level_current: 1,
          interview_sessions_completed: 0,
          boss_battles_completed: 0,
          missions_completed_today: 0,
          last_activity_date: today,
        })
        .select("*")
        .single();

      if (insertError || !inserted) {
        return NextResponse.json({ error: "Failed to create progress" }, { status: 500 });
      }

      progress = inserted;
    }

    const sameDay = progress.vitals_today_date === today;

    const nextVitalsToday = sameDay ? progress.vitals_today + vitals : vitals;

    let nextActiveDays = progress.active_days_this_week;
    if (!sameDay && vitals >= 30) {
      nextActiveDays += 1;
    }

    const nextMomentum = getMomentumState(nextActiveDays);

    const nextInterviewSessions =
      source === "interview_session"
        ? progress.interview_sessions_completed + 1
        : progress.interview_sessions_completed;

    const isBossBattle = source.startsWith("boss_battle_tier_");
    const nextBossBattles = isBossBattle
      ? progress.boss_battles_completed + 1
      : progress.boss_battles_completed;

    let nextBossUnlocked = progress.boss_level_unlocked;

    if (nextInterviewSessions >= 3) nextBossUnlocked = Math.max(nextBossUnlocked, 2);
    if (progress.vitals_total + vitals >= 300 || nextInterviewSessions >= 6) {
      nextBossUnlocked = Math.max(nextBossUnlocked, 3);
    }
    if (nextBossBattles >= 2 && nextBossUnlocked >= 3) {
      nextBossUnlocked = Math.max(nextBossUnlocked, 4);
    }
    if (progress.vitals_total + vitals >= 1000 && nextActiveDays >= 5) {
      nextBossUnlocked = Math.max(nextBossUnlocked, 5);
    }

    const { error: logError } = await supabase.from("vitals_events").insert({
      clerk_user_id: userId,
      source,
      source_id: sourceId ?? null,
      vitals,
      label,
    });

    if (logError) {
      return NextResponse.json({ error: "Failed to log vitals event" }, { status: 500 });
    }

    const { data: updated, error: updateError } = await supabase
      .from("command_progress")
      .update({
        vitals_total: progress.vitals_total + vitals,
        vitals_today: nextVitalsToday,
        vitals_today_date: today,
        momentum_state: nextMomentum,
        active_days_this_week: nextActiveDays,
        boss_level_unlocked: nextBossUnlocked,
        interview_sessions_completed: nextInterviewSessions,
        boss_battles_completed: nextBossBattles,
        last_activity_date: today,
      })
      .eq("clerk_user_id", userId)
      .select("*")
      .single();

    if (updateError || !updated) {
      return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      vitalsAwarded: vitals,
      progress: updated,
    });
  } catch {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}