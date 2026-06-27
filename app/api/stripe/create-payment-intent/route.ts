import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-server";
import { calculateCheckoutTotals } from "@/lib/checkout/calculateTotals";
import { validateCartItems } from "@/lib/checkout/validateCart";
import type { CheckoutPayload } from "@/lib/checkout/types";
import { generateOrderNumber } from "@/lib/checkout/createOrder";
import { isStripePaymentMethod } from "@/lib/checkout/paymentMethods";
import { STRIPE_CURRENCY, toStripeAmount } from "@/lib/stripe/config";
import { getStripeServer } from "@/lib/stripe/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Please log in to continue to payment." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as Pick<
      CheckoutPayload,
      "items" | "shippingMethod" | "paymentMethod" | "shippingAddress" | "currency"
    >;

    if (!isStripePaymentMethod(body.paymentMethod)) {
      return NextResponse.json(
        { error: "This endpoint is only for card and wallet payments." },
        { status: 400 }
      );
    }

    if (
      !body.shippingAddress?.email ||
      !body.shippingAddress.firstName ||
      !body.shippingAddress.lastName ||
      !body.shippingAddress.country ||
      !body.shippingAddress.city ||
      !body.shippingAddress.streetAddress
    ) {
      return NextResponse.json(
        { error: "Complete shipping and contact details are required." },
        { status: 400 }
      );
    }

    const items = await validateCartItems(body.items);
    const totals = calculateCheckoutTotals(items, body.shippingMethod);
    const orderNumber = generateOrderNumber();
    const stripe = getStripeServer();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: toStripeAmount(totals.total),
      currency: STRIPE_CURRENCY,
      automatic_payment_methods: { enabled: true },
      receipt_email: body.shippingAddress.email,
      metadata: {
        orderNumber,
        customerEmail: body.shippingAddress.email,
        paymentMethod: body.paymentMethod,
      },
      description: `Dedox order ${orderNumber}`,
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Stripe did not return a client secret.");
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderNumber,
      amount: totals.total,
      currency: STRIPE_CURRENCY.toUpperCase(),
    });
  } catch (error) {
    console.error("STRIPE_CREATE_PI_ERROR:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to start payment",
      },
      { status: 500 }
    );
  }
}
