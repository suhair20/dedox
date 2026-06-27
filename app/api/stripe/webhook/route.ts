import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeWebhookSecret } from "@/lib/stripe/config";
import { getStripeServer } from "@/lib/stripe/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripeServer();
  const webhookSecret = getStripeWebhookSecret();
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret) {
    console.warn("STRIPE_WEBHOOK_SECRET not set — webhook ignored.");
    return NextResponse.json({ received: true });
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("STRIPE_WEBHOOK_SIGNATURE_ERROR:", error);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.info("Stripe payment succeeded:", paymentIntent.id, paymentIntent.metadata?.orderNumber);
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.warn("Stripe payment failed:", paymentIntent.id, paymentIntent.last_payment_error?.message);
    }
  } catch (error) {
    console.error("STRIPE_WEBHOOK_HANDLER_ERROR:", error);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
