import { NextRequest, NextResponse } from "next/server";
import { runMedicalSchoolChecker } from "@/lib/medical-schools/run-checker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (process.env.CRON_SECRET) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  try {
    const result = await runMedicalSchoolChecker();

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown check error";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}