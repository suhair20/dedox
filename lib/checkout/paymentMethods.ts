import type { PaymentMethod } from "@/lib/checkout/types";

export function isStripePaymentMethod(
  method: PaymentMethod
): method is "card" | "upi" | "paypal" {
  return method === "card" || method === "upi" || method === "paypal";
}

export function paymentMethodLabel(method: PaymentMethod) {
  switch (method) {
    case "card":
      return "Credit / Debit Card";
    case "upi":
      return "UPI / Digital Wallet";
    case "paypal":
      return "PayPal";
    case "cod":
      return "Cash on Delivery";
    default:
      return method;
  }
}
