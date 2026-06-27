import type { CheckoutTotals, ShippingMethod, ValidatedCheckoutItem } from "@/lib/checkout/types";

const VAT_RATE = 0.05;
const EXPRESS_SHIPPING_AED = 50;

export function calculateCheckoutTotals(
  items: ValidatedCheckoutItem[],
  shippingMethod: ShippingMethod
): CheckoutTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === "express" ? EXPRESS_SHIPPING_AED : 0;
  const tax = Number((subtotal * VAT_RATE).toFixed(2));
  const total = Number((subtotal + shippingCost + tax).toFixed(2));

  return { subtotal, shippingCost, tax, total };
}
