"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MIN_ORDER_TOTAL, POINTS_PER_UNIT } from "@/lib/loyalty/config";

const steps = [
  { n: "01", title: "Shop", text: `AED ${POINTS_PER_UNIT} → 1 pt`, long: `Every AED ${POINTS_PER_UNIT} on a qualifying order` },
  { n: "02", title: "Earn", text: "After delivery", long: "1 point credited after delivery" },
  { n: "03", title: "Redeem", text: "Free bottle", long: "Unlock a free premium bottle" },
];

export default function LoyaltyTeaser() {
  const { isAuthenticated, loading } = useAuth();
  const href =
    !loading && isAuthenticated
      ? "/account/rewards"
      : "/login?redirect=/account/rewards";

  return (
    <section className="overflow-hidden bg-white py-8 sm:py-16 lg:py-20" id="rewards">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[1.5rem] bg-[#1a0505] px-4 py-7 text-center shadow-[0_30px_80px_rgba(122,12,12,0.22)] sm:rounded-[2.5rem] sm:px-10 sm:py-14 sm:text-left lg:px-14"
        >
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#7a0c0c]/50 blur-3xl"
              animate={{ x: [0, 24, 0], y: [0, 16, 0], opacity: [0.45, 0.7, 0.45] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
              animate={{ x: [0, -20, 0], y: [0, -18, 0], opacity: [0.25, 0.5, 0.25] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />
            <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:inset-x-10" />
          </div>

          <motion.div
            className="pointer-events-none absolute right-6 top-8 hidden sm:block lg:right-12 lg:top-12"
            animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-amber-200/30 bg-white/5 backdrop-blur-md lg:h-24 lg:w-24">
              <Gift className="h-8 w-8 text-amber-200 lg:h-10 lg:w-10" />
              <motion.span
                className="absolute -right-1 -top-1 text-amber-200"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.span>
            </div>
          </motion.div>

          <div className="relative mx-auto flex max-w-xl flex-col items-center lg:mx-0 lg:max-w-none lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
            <div className="flex w-full flex-col items-center sm:items-start lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-amber-200 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.22em]"
              >
                <Star className="h-3 w-3 fill-amber-200 text-amber-200" />
                Dedox Rewards
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="mt-3 max-w-[18rem] font-serif-luxury text-[1.55rem] leading-tight text-white sm:mt-5 sm:max-w-xl sm:text-5xl"
              >
                Spend AED {POINTS_PER_UNIT}.
                <span className="block italic text-amber-100/90">Earn a bottle.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-3 max-w-[19rem] text-[13px] leading-relaxed text-white/70 sm:mt-4 sm:max-w-lg sm:text-left sm:text-base"
              >
                <span className="sm:hidden">
                  AED {POINTS_PER_UNIT} spent → 1 point. Orders of AED{" "}
                  {MIN_ORDER_TOTAL.toLocaleString()}+ earn after delivery. Redeem a
                  free premium bottle.
                </span>
                <span className="hidden sm:inline">
                  Become a Dedox Rewards member and every qualifying order works for
                  you. Spend AED {POINTS_PER_UNIT} and earn 1 point. Orders of AED{" "}
                  {MIN_ORDER_TOTAL.toLocaleString()}+ start collecting after delivery.
                  Keep shopping, watch your balance grow, and redeem a free premium
                  bottle on your next paid order — a gift from the house, not a
                  discount code.
                </span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-5 flex w-full justify-center sm:mt-7 sm:justify-start"
              >
                <Link
                  href={href}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-100 via-white to-amber-50 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7a0c0c] shadow-[0_12px_30px_rgba(251,191,36,0.18)] sm:px-7 sm:py-3.5 sm:text-[11px] sm:tracking-[0.18em]"
                >
                  <motion.span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
                    animate={{ translateX: ["-120%", "120%"] }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6 }}
                  />
                  <Gift className="relative h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="relative">
                    {isAuthenticated ? "View my points" : "Join Rewards"}
                  </span>
                  <ArrowRight className="relative h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
                </Link>
              </motion.div>
            </div>

            <div className="mt-6 grid w-full grid-cols-3 gap-2 sm:mt-8 sm:gap-3 lg:mt-0">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.12, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] px-1.5 py-3 text-center backdrop-blur-sm sm:rounded-2xl sm:px-3 sm:py-6"
                >
                  <motion.div
                    className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-200 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.55 + idx * 0.12, duration: 0.6 }}
                  />
                  <p className="text-[8px] font-black tracking-[0.18em] text-amber-200/80 sm:text-[10px] sm:tracking-[0.22em]">
                    {step.n}
                  </p>
                  <p className="mt-1 font-serif-luxury text-sm text-white sm:mt-2 sm:text-2xl">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[9px] leading-snug text-white/55 sm:text-xs">
                    <span className="sm:hidden">{step.text}</span>
                    <span className="hidden sm:inline">{step.long}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
