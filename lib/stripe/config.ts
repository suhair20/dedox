const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

function keyMode(key: string): "live" | "test" | "unknown" {
  if (key.includes("_live_")) return "live";
  if (key.includes("_test_")) return "test";
  return "unknown";
}

export function getStripePublishableKey(): string {
  if (!publishableKey) {
    throw new Error(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing. Add your Stripe publishable key (pk_live_… or pk_test_…) to env."
    );
  }
  return publishableKey;
}

export function getStripeSecretKey(): string {
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is missing. Add your Stripe secret key (sk_live_… or sk_test_…) to env."
    );
  }

  if (publishableKey) {
    const pubMode = keyMode(publishableKey);
    const secMode = keyMode(secretKey);
    if (pubMode !== "unknown" && secMode !== "unknown" && pubMode !== secMode) {
      throw new Error(
        `Stripe key mismatch: publishable is ${pubMode} but secret is ${secMode}. Use both live or both test keys.`
      );
    }
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
