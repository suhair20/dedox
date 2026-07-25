import { EXPIRY_DAYS, MIN_ORDER_TOTAL, POINTS_PER_UNIT } from "./config";

/** Points earned from a single order total (0 if below minimum). */
export function pointsFor(total: number): number {
  if (typeof total !== "number" || !Number.isFinite(total) || total < MIN_ORDER_TOTAL) {
    return 0;
  }
  return Math.floor(total / POINTS_PER_UNIT);
}

/** True when `date` falls inside the rolling expiry window ending now. */
export function isWithinWindow(date: string | Date, now = new Date()): boolean {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return false;

  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - EXPIRY_DAYS);
  return value.getTime() >= windowStart.getTime() && value.getTime() <= now.getTime();
}

/** ISO timestamp for the start of the active points window. */
export function windowStartIso(now = new Date()): string {
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - EXPIRY_DAYS);
  return windowStart.toISOString();
}
