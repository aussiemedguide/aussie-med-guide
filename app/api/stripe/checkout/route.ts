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
  plan: "pro_monthly" | "pro_annual";
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

    if (plan !== "pro_monthly" && plan !== "pro_annual") {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'pro_monthly' or 'pro_annual'." },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress ?? undefined;

    const priceId =
      plan === "pro_monthly"
        ? process.env.STRIPE_PRO_MONTHLY
        : process.env.STRIPE_PRO_ANNUAL;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Stripe price ID in environment variables." },
        { status: 500 }
      );
    }

    const { data: existingSubscription, error: subscriptionError } =
      await supabase
        .from("subscriptions")
        .select("*")
        .eq("clerk_user_id", userId)
        .maybeSingle();

    if (subscriptionError) {
      console.error("Failed to load subscription record:", subscriptionError);
      return NextResponse.json(
        { error: "Failed to load subscription record." },
        { status: 500 }
      );
    }

    let subscription = existingSubscription;

    if (!subscription) {
      const { data: createdSubscription, error: createSubscriptionError } =
        await supabase
          .from("subscriptions")
          .insert({
            clerk_user_id: userId,
            plan: "free",
            status: "free",
            stripe_customer_id: null,
            stripe_subscription_id: null,
            stripe_price_id: null,
            cancel_at_period_end: false,
            current_period_end: null,
          })
          .select("*")
          .single();

      if (createSubscriptionError || !createdSubscription) {
        console.error(
          "Failed to create subscription record:",
          createSubscriptionError
        );
        return NextResponse.json(
          { error: "Failed to create subscription record." },
          { status: 500 }
        );
      }

      subscription = createdSubscription;
    }

    const alreadyOnRequestedPlan =
      subscription?.plan === plan &&
      (subscription?.status === "active" || subscription?.status === "trialing");

    if (alreadyOnRequestedPlan) {
      return NextResponse.json(
        { error: "You are already on this plan." },
        { status: 400 }
      );
    }

    let stripeCustomerId: string | null =
      subscription?.stripe_customer_id ?? null;

    if (stripeCustomerId) {
      try {
        const existingCustomer = await stripe.customers.retrieve(stripeCustomerId);

        if ("deleted" in existingCustomer && existingCustomer.deleted) {
          stripeCustomerId = null;
        } else {
          await stripe.customers.update(stripeCustomerId, {
            email,
            metadata: {
              clerk_user_id: userId,
            },
          });
        }
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

      const { data: updatedSubscription, error: updateSubscriptionError } =
        await supabase
          .from("subscriptions")
          .update({
            stripe_customer_id: stripeCustomerId,
          })
          .eq("clerk_user_id", userId)
          .select("*")
          .single();

      if (updateSubscriptionError || !updatedSubscription) {
        console.error(
          "Failed to save Stripe customer ID:",
          updateSubscriptionError
        );
        return NextResponse.json(
          { error: "Failed to save customer record." },
          { status: 500 }
        );
      }

      subscription = updatedSubscription;
    }

    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      client_reference_id: userId,
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

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown checkout error",
      },
      { status: 500 }
    );
  }
}