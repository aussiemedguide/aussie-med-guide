import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getBaseUrl(req: Request) {
  const origin = req.headers.get("origin");
  if (origin) return origin;
  return process.env.NEXT_PUBLIC_APP_URL || "https://www.aussiemedguide.com";
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, plan, status")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Failed to load subscription for portal:", error);
      return NextResponse.json(
        { error: "Failed to load billing record." },
        { status: 500 }
      );
    }

    const stripeCustomerId = subscription?.stripe_customer_id ?? null;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found for this user." },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(req);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/info/pricing`,
    });

    if (!portalSession.url) {
      return NextResponse.json(
        { error: "Stripe did not return a portal URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Stripe portal error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown portal error",
      },
      { status: 500 }
    );
  }
}