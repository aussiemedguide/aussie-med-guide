import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type CheckoutRequestBody = {
  plan: "monthly" | "annual";
};

function getBaseUrl(req: Request) {
  const origin = req.headers.get("origin");
  if (origin) return origin;
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as CheckoutRequestBody;
    const plan = body?.plan;

    if (plan !== "monthly" && plan !== "annual") {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'monthly' or 'annual'." },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress ?? undefined;

    const priceId =
      plan === "monthly"
        ? process.env.STRIPE_PRO_MONTHLY
        : process.env.STRIPE_PRO_ANNUAL;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Stripe price ID in environment variables." },
        { status: 500 }
      );
    }

    const { data: existingSub, error: existingSubError } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (existingSubError) {
      console.error("Supabase read error:", existingSubError);
      return NextResponse.json(
        { error: "Failed to load subscription record." },
        { status: 500 }
      );
    }

    let stripeCustomerId = existingSub?.stripe_customer_id ?? null;

if (stripeCustomerId) {
  try {
    await stripe.customers.retrieve(stripeCustomerId);
  } catch {
    stripeCustomerId = null;
  }
}

if (!stripeCustomerId) {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      clerk_user_id: userId,
    },
  });

  stripeCustomerId = customer.id;

  const { error: upsertError } = await supabase
    .from("user_subscriptions")
    .upsert(
      {
        clerk_user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: null,
        subscription_status: "inactive",
        plan: "free",
      },
      { onConflict: "clerk_user_id" }
    );

  if (upsertError) {
    console.error("Supabase upsert error:", upsertError);
    return NextResponse.json(
      { error: "Failed to save customer record." },
      { status: 500 }
    );
  }
}

    const baseUrl = getBaseUrl(req);

    console.log("plan:", plan);
    console.log("priceId:", priceId);
    console.log("baseUrl:", baseUrl);
    console.log("userId:", userId);
    console.log("email:", email);
    console.log("stripeCustomerId:", stripeCustomerId);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/info/pricing?success=true`,
      cancel_url: `${baseUrl}/info/pricing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        clerk_user_id: userId,
        plan,
      },
      subscription_data: {
        metadata: {
          clerk_user_id: userId,
          plan,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown checkout error",
      },
      { status: 500 }
    );
  }
}