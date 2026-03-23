import { NextResponse } from "next/server";
import { syncMedicalSchoolSources } from "@/lib/medical-schools/sync-sources";

export const runtime = "nodejs";

export async function POST() {
  try {
    const result = await syncMedicalSchoolSources();

    return NextResponse.json({
      ok: true,
      message: "Medical school sources synced",
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown sync error";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}