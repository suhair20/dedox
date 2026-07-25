/** Tunable loyalty economics — change here, nowhere else. */

/** Currency units per 1 loyalty point (e.g. 10 AED → 1 point). */
export const POINTS_PER_UNIT = 10;

/** Minimum order total required to earn any points. */
export const MIN_ORDER_TOTAL = 1000;

/** Rolling window for earned and redeemed points. */
export const EXPIRY_DAYS = 365;

/** Order status that credits points toward the balance. */
export const EARN_STATUS = "delivered" as const;
