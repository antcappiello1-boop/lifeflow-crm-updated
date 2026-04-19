import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function toIso(ts?: number | null) {
  return ts ? new Date(ts * 1000).toISOString() : null;
}

async function upsertSubscriptionFromStripe(subscription: Stripe.Subscription) {
  const supabaseAdmin = getSupabaseAdminClient();
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;
  await supabaseAdmin.from("subscriptions").upsert({
    user_id: userId,
    stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : null,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    trial_ends_at: toIso(subscription.trial_end),
    current_period_ends_at: toIso(subscription.current_period_end),
  });
}

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Missing Stripe webhook config." }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature || "", webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id || session.metadata?.supabase_user_id;
      if (userId) {
        const supabaseAdmin = getSupabaseAdminClient();
        await supabaseAdmin.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          status: session.mode === "subscription" ? "trialing" : "active",
        });
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      await upsertSubscriptionFromStripe(event.data.object as Stripe.Subscription);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const supabaseAdmin = getSupabaseAdminClient();
      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: "canceled",
          current_period_ends_at: toIso(subscription.current_period_end),
          trial_ends_at: toIso(subscription.trial_end),
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
