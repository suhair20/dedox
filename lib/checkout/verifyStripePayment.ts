import { STRIPE_CURRENCY, toStripeAmount } from "@/lib/stripe/config";
import { getStripeServer } from "@/lib/stripe/server";

export async function verifyStripePayment(
  paymentIntentId: string,
  expectedTotalAed: number
): Promise<void> {
  const stripe = getStripeServer();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    throw new Error("Payment has not been completed. Please try again.");
  }

  if (paymentIntent.currency !== STRIPE_CURRENCY) {
    throw new Error("Payment currency mismatch.");
  }

  const expectedAmount = toStripeAmount(expectedTotalAed);
  if (paymentIntent.amount !== expectedAmount) {
    throw new Error("Payment amount does not match order total.");
  }
}
