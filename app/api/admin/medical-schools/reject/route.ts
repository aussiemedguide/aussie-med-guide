import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("medical_school_updates")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.redirect(new URL("/admin/medical-schools/updates", req.url));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown reject error";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}