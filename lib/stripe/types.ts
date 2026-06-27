export type StripePaymentIntentResponse = {
  clientSecret: string;
  paymentIntentId: string;
  orderNumber: string;
  amount: number;
  currency: string;
};

export type StripePaymentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "requires_action"
  | "processing"
  | "succeeded"
  | "canceled";
