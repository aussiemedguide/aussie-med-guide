import { NextRequest, NextResponse } from "next/server";
import { applyApprovedUpdate } from "@/lib/medical-schools/apply-approved-update";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const id = Number(req.nextUrl.searchParams.get("id"));

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "Missing valid update id" },
        { status: 400 }
      );
    }

    await applyApprovedUpdate(id);

    return NextResponse.redirect(new URL("/admin/medical-schools/updates", req.url));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown approve error";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}