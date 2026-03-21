import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function upsertSubscriptionRecord(params: {
  clerkUserId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  subscriptionStatus: string;
  plan: string;
  currentPeriodEnd?: string | null;
}) {
  const {
    clerkUserId,
    stripeCustomerId,
    stripeSubscriptionId,
    subscriptionStatus,
    plan,
    currentPeriodEnd,
  } = params;

  const { error } = await supabase.from("user_subscriptions").upsert(
    {
      clerk_user_id: clerkUserId,
      stripe_customer_id: stripeCustomerId ?? null,
      stripe_subscription_id: stripeSubscriptionId ?? null,
      subscription_status: subscriptionStatus,
      plan,
      current_period_end: currentPeriodEnd ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "clerk_user_id" }
  );

  if (error) throw error;
}

function getPlanFromPriceId(priceId?: string | null) {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_PRO_MONTHLY) return "monthly";
  if (priceId === process.env.STRIPE_PRO_ANNUAL) return "annual";
  return "free";
}

async function getClerkUserIdFromCustomer(customerId?: string | null) {
  if (!customerId) return null;

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("clerk_user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) {
    console.error("Failed to find clerk user from stripe customer:", error);
    return null;
  }

  return data?.clerk_user_id ?? null;
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
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const clerkUserId = session.metadata?.clerk_user_id ?? null;
        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : null;
        const stripeSubscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;
        const plan = session.metadata?.plan ?? "free";

        if (!clerkUserId) {
          console.warn("Missing clerk_user_id in checkout session metadata");
          break;
        }

        let currentPeriodEnd: string | null = null;

        if (stripeSubscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(
            stripeSubscriptionId
          );

          const periodEnd = (subscription as Stripe.Subscription & {
            current_period_end?: number;
          }).current_period_end;

          if (periodEnd) {
            currentPeriodEnd = new Date(periodEnd * 1000).toISOString();
          }
        }

        await upsertSubscriptionRecord({
          clerkUserId,
          stripeCustomerId,
          stripeSubscriptionId,
          subscriptionStatus: "active",
          plan,
          currentPeriodEnd,
        });

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const stripeCustomerId =
          typeof subscription.customer === "string" ? subscription.customer : null;

        let clerkUserId = subscription.metadata?.clerk_user_id ?? null;

        if (!clerkUserId) {
          clerkUserId = await getClerkUserIdFromCustomer(stripeCustomerId);
        }

        const priceId = subscription.items.data[0]?.price?.id ?? null;
        const plan = subscription.metadata?.plan || getPlanFromPriceId(priceId);

        const periodEnd = (subscription as Stripe.Subscription & {
          current_period_end?: number;
        }).current_period_end;

        const currentPeriodEnd = periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : null;

        if (!clerkUserId) {
          console.warn("Could not resolve clerk_user_id for subscription event");
          break;
        }

        await upsertSubscriptionRecord({
          clerkUserId,
          stripeCustomerId,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          plan,
          currentPeriodEnd,
        });

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
          subscriptionStatus: "canceled",
          plan: "free",
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
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}