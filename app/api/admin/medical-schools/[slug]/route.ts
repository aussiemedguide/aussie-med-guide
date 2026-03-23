import { NextResponse } from "next/server";
import { runMedicalSchoolChecker } from "@/lib/medical-schools/run-checker";

export const runtime = "nodejs";

export async function POST() {
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