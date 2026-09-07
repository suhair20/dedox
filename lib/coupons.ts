import { client, getSanityWriteClient } from "@/lib/sanity";

export type CouponType = "percent" | "fixed";

export type CouponDoc = {
  _id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrder?: number;
  maxUses?: number;
  usedCount?: number;
  expiresAt?: string;
  isActive?: boolean;
};

export const COUPON_PROJECTION = `{
  _id,
  code,
  type,
  value,
  minOrder,
  maxUses,
  usedCount,
  expiresAt,
  isActive
}`;

export function normalizeCouponCode(code: string) {
  return String(code || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

export function discountFromCoupon(subtotal: number, coupon: CouponDoc) {
  const value = Number(coupon.value) || 0;
  const raw =
    coupon.type === "fixed" ? value : (subtotal * value) / 100;
  return Number(Math.min(Math.max(0, raw), subtotal).toFixed(2));
}

export function assertCouponUsable(coupon: CouponDoc, subtotal: number) {
  if (coupon.isActive === false) {
    throw new Error("This coupon is no longer active.");
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    throw new Error("This coupon has expired.");
  }
  const maxUses = Number(coupon.maxUses) || 0;
  const usedCount = Number(coupon.usedCount) || 0;
  if (maxUses > 0 && usedCount >= maxUses) {
    throw new Error("This coupon has reached its usage limit.");
  }
  const minOrder = Number(coupon.minOrder) || 0;
  if (minOrder > 0 && subtotal < minOrder) {
    throw new Error(`This coupon requires a subtotal of at least AED ${minOrder}.`);
  }
}

export async function fetchCouponByCode(code: string) {
  const normalized = normalizeCouponCode(code);
  if (!normalized) return null;

  return client.fetch<CouponDoc | null>(
    `*[_type == "coupon" && code == $code][0] ${COUPON_PROJECTION}`,
    { code: normalized }
  );
}

export async function incrementCouponUse(couponId: string) {
  const writeClient = getSanityWriteClient();
  await writeClient.patch(couponId).inc({ usedCount: 1 }).commit();
}
