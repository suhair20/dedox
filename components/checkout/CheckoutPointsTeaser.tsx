"use client";

import Link from "next/link";
import { Gift, Sparkles, Star } from "lucide-react";
import { MIN_ORDER_TOTAL, POINTS_PER_UNIT } from "@/lib/loyalty/config";

type CheckoutPointsTeaserProps = {
  orderTotal: number;
  pointsEarned: number;
  currentBalance: number;
  cheapestRewardCost?: number | null;
  isNewMember?: boolean;
  isGuest?: boolean;
};

export default function CheckoutPointsTeaser({
  orderTotal,
  pointsEarned,
  currentBalance,
  cheapestRewardCost,
  isNewMember = false,
  isGuest = false,
}: CheckoutPointsTeaserProps) {
  const projectedBalance = currentBalance + pointsEarned;
  const nextCost = cheapestRewardCost && cheapestRewardCost > 0 ? cheapestRewardCost : 500;
  const remaining = Math.max(0, nextCost - projectedBalance);
  const belowMinimum = orderTotal < MIN_ORDER_TOTAL;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[#7a0c0c]/15 bg-gradient-to-br from-[#fff8f7] via-white to-[#fff1ec] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7a0c0c] text-white">
          <Sparkles className="h-4 w-4 text-amber-300" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a0c0c]">
            Dedox Rewards
          </p>
          <p className="mt-1 text-sm font-bold text-gray-900">
            {isGuest
              ? "Sign in to earn points on this order"
              : isNewMember
                ? "Your first order earns Rewards points"
                : "Points you’ll earn on this order"}
          </p>

          {isGuest ? (
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Create a free account before placing — when this order is delivered
              you’ll earn points. Keep shopping and unlock a free premium bottle.
            </p>
          ) : belowMinimum ? (
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Add a little more to reach {MIN_ORDER_TOTAL}+ and start earning
              points (1 pt per {POINTS_PER_UNIT} spent).
            </p>
          ) : (
            <>
              <div className="mt-3 flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-serif-luxury text-2xl font-bold text-[#7a0c0c]">
                  +{pointsEarned}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  points
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Credited after delivery. After you collect enough points, redeem a
                free bottle on your next paid order.
              </p>
              {remaining > 0 ? (
                <p className="mt-2 text-xs font-medium text-[#7a0c0c]">
                  After this order you’ll have ~{projectedBalance} pts — need{" "}
                  {remaining} more for a free bottle unlock.
                </p>
              ) : (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <Gift className="h-3.5 w-3.5" />
                  You’ll have enough points to unlock a free bottle on a future
                  order.
                </p>
              )}
            </>
          )}

          {isGuest ? (
            <Link
              href="/login?redirect=/checkout"
              className="mt-3 inline-flex text-xs font-bold uppercase tracking-[0.15em] text-[#7a0c0c] underline-offset-2 hover:underline"
            >
              Sign in to earn
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
