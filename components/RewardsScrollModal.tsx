"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Sparkles, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MIN_ORDER_TOTAL, POINTS_PER_UNIT } from "@/lib/loyalty/config";

const DISMISS_KEY = "dedox_rewards_modal_dismissed";
const SCROLL_TRIGGER_PX = 380;

export default function RewardsScrollModal() {
  const { isAuthenticated, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") {
        setDismissed(true);
        return;
      }
    } catch {
      // ignore
    }
    setDismissed(false);
  }, []);

  useEffect(() => {
    if (dismissed || open) return;

    const onScroll = () => {
      if (window.scrollY >= SCROLL_TRIGGER_PX) {
        setOpen(true);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed, open]);

  const close = () => {
    setOpen(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  const href = isAuthenticated
    ? "/account/rewards"
    : "/login?redirect=/account/rewards";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.button
            type="button"
            aria-label="Close rewards promo"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rewards-modal-title"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-[#7a0c0c]/10 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]"
            initial={{ opacity: 0, y: 64, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-[#7a0c0c] via-[#9a1818] to-[#4a0606] px-6 py-7 text-white">
              <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl" />
              <button
                type="button"
                onClick={close}
                aria-label="Cancel"
                className="absolute right-3 top-3 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                <Sparkles className="h-3 w-3 text-amber-300" />
                Dedox Rewards
              </div>
              <h2
                id="rewards-modal-title"
                className="mt-4 font-serif-luxury text-3xl font-bold leading-tight tracking-tight"
              >
                Earn points. Unlock free bottles.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Shop {MIN_ORDER_TOTAL}+ and earn 1 pt per {POINTS_PER_UNIT}{" "}
                spent. Redeem a premium gift with your next paid order.
              </p>
            </div>

            <div className="space-y-3 px-6 py-5">
              <Link
                href={loading ? "/account/rewards" : href}
                onClick={close}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7a0c0c] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(122,12,12,0.3)] transition hover:bg-[#921010]"
              >
                <Gift className="h-4 w-4" />
                Explore Rewards
              </Link>
              <button
                type="button"
                onClick={close}
                className="w-full rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
              >
                Not now
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
