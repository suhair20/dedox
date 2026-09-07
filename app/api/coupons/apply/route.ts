import { NextResponse } from "next/server";
import { calculateCheckoutTotals } from "@/lib/checkout/calculateTotals";
import { validateCartItems } from "@/lib/checkout/validateCart";
import type { CheckoutItemInput, ShippingMethod } from "@/lib/checkout/types";
import {
  assertCouponUsable,
  discountFromCoupon,
  fetchCouponByCode,
  normalizeCouponCode,
} from "@/lib/coupons";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = normalizeCouponCode(String(body.code || ""));
    const items = Array.isArray(body.items) ? (body.items as CheckoutItemInput[]) : [];
    const shippingMethod = (body.shippingMethod === "express" ? "express" : "standard") as ShippingMethod;

    if (!code) {
      return NextResponse.json({ error: "Enter a coupon code." }, { status: 400 });
    }

    const coupon = await fetchCouponByCode(code);
    if (!coupon) {
      return NextResponse.json({ error: "This coupon is not valid." }, { status: 400 });
    }

    const validated = await validateCartItems(items);
    const base = calculateCheckoutTotals(validated, shippingMethod);
    assertCouponUsable(coupon, base.subtotal);
    const discount = discountFromCoupon(base.subtotal, coupon);
    const totals = calculateCheckoutTotals(validated, shippingMethod, discount);

    return NextResponse.json({
      ok: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: totals.discount,
      totals,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not apply coupon." },
      { status: 400 }
    );
  }
}
