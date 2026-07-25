"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Phone, ShoppingBag, Sparkles, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  EXPIRY_DAYS,
  MIN_ORDER_TOTAL,
  POINTS_PER_UNIT,
} from "@/lib/loyalty/config";
import { savePendingReward } from "@/lib/loyalty/pendingReward";
import type { PointsSummary, RewardProduct } from "@/lib/loyalty/types";
import GiftCelebration from "@/components/rewards/GiftCelebration";

type RewardsViewProps = {
  summary: PointsSummary;
  rewards: RewardProduct[];
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600";

function formatDMY(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  return `${day}-${month}-${d.getFullYear()}`;
}

function expiryFor(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + EXPIRY_DAYS);
  return formatDMY(d.toISOString());
}

export default function RewardsView({ summary, rewards }: RewardsViewProps) {
  const [showAll, setShowAll] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const { cart, cartReady } = useCart();
  const router = useRouter();

  const sortedRewards = [...rewards].sort((a, b) => a.pointsCost - b.pointsCost);
  const nextTarget =
    sortedRewards.find((r) => r.pointsCost > summary.balance)?.pointsCost ??
    sortedRewards[0]?.pointsCost ??
    500;
  const progressPct = Math.min(
    100,
    Math.round((summary.balance / Math.max(nextTarget, 1)) * 100)
  );
  const visibleHistory = showAll
    ? summary.history
    : summary.history.slice(0, 5);

  function claimReward(reward: RewardProduct) {
    savePendingReward({
      productId: reward._id,
      name: reward.name,
      pointsCost: reward.pointsCost,
    });

    setShowBurst(true);

    window.setTimeout(() => {
      // Gift only ships with a paid product — send to shop first if cart is empty.
      if (!cartReady || cart.length === 0) {
        router.push("/shop?claim=1");
        return;
      }
      router.push("/checkout");
    }, 700);
  }

  return (
    <div className="relative space-y-7">
      <GiftCelebration
        active={showBurst}
        intensity="small"
        onComplete={() => setShowBurst(false)}
      />
      {/* Balance — soft light panel, not a solid red block */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[28px] border border-[#7a0c0c]/10 bg-gradient-to-br from-[#fff8f7] via-white to-[#fff1ec] px-5 py-6 shadow-[0_20px_50px_rgba(122,12,12,0.14)] sm:rounded-[32px] sm:px-7 sm:py-7"
      >
        <div className="pointer-events-none absolute -right-6 -top-8 h-36 w-36 rounded-full bg-[#7a0c0c]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-amber-300/25 blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#7a0c0c]/15 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a0c0c] shadow-sm">
              <Sparkles className="h-3 w-3 text-amber-500" />
              Dedox Rewards
            </div>
            <p className="mt-4 text-sm text-gray-500">Your balance</p>
            <p className="mt-1 font-serif-luxury text-5xl font-bold tracking-tight text-gray-900">
              {summary.balance}
              <span className="ml-2 text-base font-sans font-semibold uppercase tracking-[0.18em] text-gray-400">
                pts
              </span>
            </p>
          </div>

          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#7a0c0c] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_25px_rgba(122,12,12,0.3)]"
          >
            <Star className="h-4 w-4 fill-white" />
            {summary.balance} points
          </motion.span>
        </div>

        <div className="relative mt-6">
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            <span>Next unlock</span>
            <span className="text-[#7a0c0c]">
              {summary.balance} / {nextTarget}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#7a0c0c]/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#7a0c0c] to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            />
          </div>
        </div>
      </motion.section>

      {summary.expiringSoon > 0 ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800">
          {summary.expiringSoon} points are nearing expiry — redeem them soon.
        </p>
      ) : null}

      {/* Card-type reward bottles */}
      {sortedRewards.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-5 py-12 text-center">
          <Gift className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">
            Reward bottles will appear here soon.
          </p>
        </div>
      ) : (
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {sortedRewards.map((reward, idx) => {
            const affordable = summary.balance >= reward.pointsCost;
            const remaining = reward.pointsCost - summary.balance;
            return (
              <motion.div
                key={reward._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * idx, duration: 0.4 }}
                whileHover={{ y: -5 }}
                className="w-[78%] shrink-0 snap-start sm:w-auto"
              >
                <div
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] border bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14),0_6px_16px_rgba(122,12,12,0.08)] transition-shadow duration-300 hover:shadow-[0_28px_60px_rgba(122,12,12,0.2),0_10px_24px_rgba(15,23,42,0.12)] ${
                    affordable
                      ? "border-[#7a0c0c]/20"
                      : "border-gray-100"
                  }`}
                >
                  <div className="relative h-52 w-full shrink-0 overflow-hidden bg-gray-100 sm:h-56">
                    <Image
                      src={reward.imageUrl || FALLBACK_IMAGE}
                      alt={reward.name}
                      fill
                      unoptimized
                      className="object-cover object-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-110"
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#7a0c0c] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
                      <Gift className="h-3 w-3" />
                      Free
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <p className="text-center text-sm font-bold text-gray-900 sm:text-base">
                      {reward.name}
                    </p>

                    <div className="mt-2 flex items-center justify-center gap-1.5 text-sm font-bold">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-gray-900">{reward.pointsCost}</span>
                      <span className="text-gray-400">points</span>
                    </div>

                    {affordable ? (
                      <motion.div
                        className="mt-4"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <button
                          type="button"
                          onClick={() => claimReward(reward)}
                          className="group/btn relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#7a0c0c] via-[#a31212] to-[#7a0c0c] bg-[length:200%_100%] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(122,12,12,0.35)] transition-[background-position] duration-500 hover:bg-right"
                        >
                          <motion.span
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                            initial={{ x: "-100%" }}
                            animate={{ x: "280%" }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              repeatDelay: 2.2,
                              ease: "easeInOut",
                            }}
                          />
                          <span className="relative">Get Reward</span>
                          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform group-hover/btn:translate-x-0.5">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </button>
                      </motion.div>
                    ) : (
                      <div className="mt-4">
                        <button
                          type="button"
                          disabled
                          className="flex w-full cursor-not-allowed items-center justify-between rounded-2xl bg-gray-100 px-5 py-3.5 text-sm font-bold text-gray-400"
                        >
                          <span>Get Reward</span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </button>
                        <div className="mt-2.5">
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#7a0c0c]/60 to-amber-400"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round(
                                    (summary.balance / reward.pointsCost) * 100
                                  )
                                )}%`,
                              }}
                            />
                          </div>
                          <p className="mt-1.5 text-center text-[11px] font-medium text-gray-400">
                            {remaining} more points to unlock
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <p className="text-center text-[11px] leading-relaxed text-gray-400">
        Earn 1 point per {POINTS_PER_UNIT} spent on orders of {MIN_ORDER_TOTAL}+.
        Rewards ship free with your next paid order. Points expire after{" "}
        {EXPIRY_DAYS} days.
      </p>

      {/* History cards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-serif-luxury text-lg font-bold text-gray-900">
            Rewards History
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </h2>
          {summary.history.length > 5 ? (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="rounded-full bg-[#7a0c0c]/8 px-3 py-1.5 text-sm font-semibold text-[#7a0c0c] transition hover:bg-[#7a0c0c]/15"
            >
              {showAll ? "Show less" : "View All"}
            </button>
          ) : null}
        </div>

        {summary.history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-10 text-center">
            <p className="text-sm text-gray-500">
              Points appear after your orders are marked delivered.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#7a0c0c] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-white"
            >
              Shop now
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {visibleHistory.map((item, idx) => {
              const earned = item.type === "earned";
              return (
                <motion.li
                  key={`${item.type}-${item.date}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * idx }}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-gray-50 bg-white px-4 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.1),0_4px_12px_rgba(122,12,12,0.05)]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${
                        earned ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    >
                      {earned ? (
                        <Star className="h-5 w-5 fill-white" />
                      ) : (
                        <ShoppingBag className="h-5 w-5" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold text-gray-900">
                        {earned ? "Purchase" : "Reward unlocked"}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {formatDMY(item.date)}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-[15px] font-bold ${
                        earned ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {earned ? "+" : "−"}
                      {item.points}{" "}
                      <span className="font-semibold text-gray-500">points</span>
                    </p>
                    {earned ? (
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        Expiry: {expiryFor(item.date)}
                      </p>
                    ) : null}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="flex items-center justify-between border-t border-gray-100 pt-6 text-sm font-semibold text-[#7a0c0c]">
        <Link href="/shop" className="hover:underline">
          Explore collection
        </Link>
        <a
          href="tel:+911234567890"
          className="inline-flex items-center gap-1.5 hover:underline"
        >
          <Phone className="h-4 w-4" />
          Call Support
        </a>
      </div>
    </div>
  );
}
