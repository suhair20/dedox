"use client";

import Image from "next/image";
import { Gift } from "lucide-react";
import type { RewardProduct } from "@/lib/loyalty/types";

type CheckoutRewardsSectionProps = {
  balance: number;
  rewards: RewardProduct[];
  selectedRewardId: string | null;
  onSelect: (productId: string | null) => void;
};

export default function CheckoutRewardsSection({
  balance,
  rewards,
  selectedRewardId,
  onSelect,
}: CheckoutRewardsSectionProps) {
  const affordable = rewards.filter((r) => r.pointsCost <= balance);

  if (affordable.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-5 flex items-center space-x-3 sm:mb-6 sm:space-x-4">
        <div className="h-5 w-1 rounded-full bg-[#7a0c0c] sm:h-6 sm:w-1.5" />
        <h2 className="font-serif-luxury text-lg font-bold tracking-tight text-gray-900 sm:text-2xl">
          Redeem points
        </h2>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-[#7a0c0c]/15 bg-[#7a0c0c]/5 px-4 py-3 text-sm text-gray-700">
        <Gift className="h-4 w-4 shrink-0 text-[#7a0c0c]" />
        <span>
          You have <strong className="text-[#7a0c0c]">{balance} points</strong>.
          Choose a free premium bottle — it ships with this paid order.
        </span>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
            selectedRewardId === null
              ? "border-[#7a0c0c] bg-white shadow-lg"
              : "border-gray-50 bg-white/50 opacity-70 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                selectedRewardId === null ? "border-[#7a0c0c]" : "border-gray-300"
              }`}
            >
              {selectedRewardId === null ? (
                <div className="h-2.5 w-2.5 rounded-full bg-[#7a0c0c]" />
              ) : null}
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">
              No reward this order
            </span>
          </div>
        </button>

        {affordable.map((reward) => {
          const selected = selectedRewardId === reward._id;
          return (
            <button
              key={reward._id}
              type="button"
              onClick={() => onSelect(reward._id)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                selected
                  ? "border-[#7a0c0c] bg-white shadow-lg"
                  : "border-gray-50 bg-white/50 opacity-70 hover:border-gray-200"
              }`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-[#7a0c0c]" : "border-gray-300"
                  }`}
                >
                  {selected ? (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#7a0c0c]" />
                  ) : null}
                </div>
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                  <Image
                    src={
                      reward.imageUrl ||
                      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=200"
                    }
                    alt={reward.name}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-black uppercase tracking-widest text-gray-900">
                    {reward.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Free gift · {reward.pointsCost} pts
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-green-600">
                Free
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
