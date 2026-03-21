import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      name,
      yearLevel,
      state,
      category,
      pathway,
      atar,
      ucat,
      interviewScore,
      targetUnis,
      avatar,
    } = body;

    const { error } = await supabase.from("command_profiles").upsert(
      {
        user_id: userId,
        display_name: name,
        year_level: yearLevel,
        state,
        category,
        pathway,
        atar,
        ucat,
        interview_score: interviewScore,
        target_unis: targetUnis,
        avatar,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to save profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}