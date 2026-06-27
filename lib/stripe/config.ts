const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

export function getStripePublishableKey(): string {
  if (!publishableKey) {
    throw new Error(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing. Add your Stripe test publishable key to .env.local."
    );
  }
  return publishableKey;
}

export function getStripeSecretKey(): string {
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is missing. Add your Stripe test secret key to .env.local."
    );
  }
  return secretKey;
}

export function getStripeWebhookSecret(): string | undefined {
  return webhookSecret || undefined;
}

export const STRIPE_CURRENCY = "aed" as const;

/** AED uses 2 decimal places — Stripe expects fils (1 AED = 100 fils). */
export function toStripeAmount(aed: number): number {
  return Math.round(aed * 100);
}

export function fromStripeAmount(fils: number): number {
  return fils / 100;
}
