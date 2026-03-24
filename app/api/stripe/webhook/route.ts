import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type AppPlan = "free" | "pro_monthly" | "pro_annual";

type AppStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | null;

function getPlanFromPriceId(priceId?: string | null): AppPlan {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_PRO_MONTHLY) return "pro_monthly";
  if (priceId === process.env.STRIPE_PRO_ANNUAL) return "pro_annual";
  return "free";
}

function mapStripeStatus(status?: string | null): AppStatus {
  if (!status) return null;

  if (
    status === "trialing" ||
    status === "active" ||
    status === "past_due" ||
    status === "canceled" ||
    status === "unpaid" ||
    status === "incomplete" ||
    status === "incomplete_expired"
  ) {
    return status;
  }

  return null;
}

function getIsoPeriodEnd(subscription: Stripe.Subscription): string | null {
  const raw = (subscription as Stripe.Subscription & {
    current_period_end?: number;
  }).current_period_end;

  return raw ? new Date(raw * 1000).toISOString() : null;
}

async function getClerkUserIdFromCustomer(customerId?: string | null) {
  if (!customerId) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("clerk_user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) {
    console.error("Failed to resolve clerk user from Stripe customer:", error);
    return null;
  }

  return data?.clerk_user_id ?? null;
}

async function upsertSubscriptionRecord(params: {
  clerkUserId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  plan: AppPlan;
  status: AppStatus;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string | null;
}) {
  const {
    clerkUserId,
    stripeCustomerId,
    stripeSubscriptionId,
    stripePriceId,
    plan,
    status,
    cancelAtPeriodEnd = false,
    currentPeriodEnd = null,
  } = params;

  const { error } = await supabase.from("subscriptions").upsert(
    {
      clerk_user_id: clerkUserId,
      stripe_customer_id: stripeCustomerId ?? null,
      stripe_subscription_id: stripeSubscriptionId ?? null,
      stripe_price_id: stripePriceId ?? null,
      plan,
      status,
      cancel_at_period_end: cancelAtPeriodEnd,
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "clerk_user_id" }
  );

  if (error) {
    throw error;
  }
}

async function handleSubscriptionUpsert(subscription: Stripe.Subscription) {
  const stripeCustomerId =
    typeof subscription.customer === "string" ? subscription.customer : null;

  let clerkUserId = subscription.metadata?.clerk_user_id ?? null;

  if (!clerkUserId) {
    clerkUserId = await getClerkUserIdFromCustomer(stripeCustomerId);
  }

  if (!clerkUserId) {
    throw new Error("Could not resolve clerk_user_id for subscription event.");
  }

  const stripePriceId = subscription.items.data[0]?.price?.id ?? null;
  const plan = getPlanFromPriceId(stripePriceId);
  const status = mapStripeStatus(subscription.status);

  await upsertSubscriptionRecord({
    clerkUserId,
    stripeCustomerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId,
    plan,
    status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
    currentPeriodEnd: getIsoPeriodEnd(subscription),
  });
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid webhook signature",
      },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription" && session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;

          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);

          await handleSubscriptionUpsert(subscription);
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpsert(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const stripeCustomerId =
          typeof subscription.customer === "string" ? subscription.customer : null;

        let clerkUserId = subscription.metadata?.clerk_user_id ?? null;

        if (!clerkUserId) {
          clerkUserId = await getClerkUserIdFromCustomer(stripeCustomerId);
        }

        if (!clerkUserId) {
          console.warn("Could not resolve clerk_user_id for deleted subscription");
          break;
        }

        await upsertSubscriptionRecord({
          clerkUserId,
          stripeCustomerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price?.id ?? null,
          plan: "free",
          status: "canceled",
          cancelAtPeriodEnd: false,
          currentPeriodEnd: null,
        });

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Webhook handler failed",
      },
      { status: 500 }
    );
  }
}