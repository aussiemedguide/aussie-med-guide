import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Webhook Error", { status: 400 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.supabase_user_id;
        const customerId = session.customer as string | null;
        const subscriptionId = session.subscription as string | null;

        if (userId) {
          await supabase
            .from("profiles")
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price?.id ?? null;

        await supabase
          .from("profiles")
          .update({
            stripe_subscription_id: subscription.id,
            plan: subscription.status,
            subscription_price_id: priceId,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      default:
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}