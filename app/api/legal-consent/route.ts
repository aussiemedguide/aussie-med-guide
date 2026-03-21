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

    const version = String(body?.version ?? "");
    const source = String(body?.source ?? "unknown");
    const plan = String(body?.plan ?? "free");

    if (!version) {
      return NextResponse.json(
        { error: "Missing consent version." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("legal_consents").insert({
      clerk_user_id: userId,
      version,
      accepted_terms: Boolean(body?.acceptedTerms),
      accepted_privacy: Boolean(body?.acceptedPrivacy),
      accepted_disclaimer: Boolean(body?.acceptedDisclaimer),
      accepted_payments: Boolean(body?.acceptedPayments),
      source,
      plan,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}