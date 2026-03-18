import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // ignore
            }
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be signed in first." },
        { status: 401 }
      );
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("profiles")
      .update({
        accepted_terms: true,
        accepted_terms_at: body.acceptedTerms ? now : null,
        accepted_privacy_at: body.acceptedPrivacy ? now : null,
        accepted_disclaimer_at: body.acceptedDisclaimer ? now : null,
        accepted_payments_terms_at: body.acceptedPayments ? now : null,
        consent_version: body.version ?? null,
        consent_source: body.source ?? "pricing_checkout",
        updated_at: now,
      })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to save consent." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}