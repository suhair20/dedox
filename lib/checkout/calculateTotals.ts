import type { CheckoutTotals, ShippingMethod, ValidatedCheckoutItem } from "@/lib/checkout/types";

const EXPRESS_SHIPPING_AED = 50;

export function calculateCheckoutTotals(
  items: ValidatedCheckoutItem[],
  shippingMethod: ShippingMethod,
  discountAmount = 0
): CheckoutTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === "express" ? EXPRESS_SHIPPING_AED : 0;
  const discount = Number(Math.min(Math.max(0, discountAmount), subtotal).toFixed(2));
  const taxable = Number((subtotal - discount).toFixed(2));
  const tax = 0;
  const total = Number((taxable + shippingCost + tax).toFixed(2));

  return { subtotal, shippingCost, tax, total, discount };
}
