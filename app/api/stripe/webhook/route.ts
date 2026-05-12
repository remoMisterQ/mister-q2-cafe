import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const supabase = createServiceClient();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  if (!signature || !webhookSecret) return NextResponse.json({ error: "Missing Stripe webhook configuration." }, { status: 400 });

  const body = await request.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      await supabase
        .from("orders")
        .update({
          stripe_session_id: session.id,
          payment_status: "paid",
          order_status: "New"
        })
        .eq("id", orderId);
    }
  }

  return NextResponse.json({ received: true });
}
