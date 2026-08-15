"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MIN_ORDER_TOTAL, POINTS_PER_UNIT } from "@/lib/loyalty/config";

const steps = [
  { n: "01", title: "Shop", text: `Every AED ${POINTS_PER_UNIT} on a qualifying order` },
  { n: "02", title: "Earn", text: "1 point credited after delivery" },
  { n: "03", title: "Redeem", text: "Unlock a free premium bottle" },
];

export default function LoyaltyTeaser() {
  const { isAuthenticated, loading } = useAuth();
  const href =
    !loading && isAuthenticated
      ? "/account/rewards"
      : "/login?redirect=/account/rewards";

  return (
    <section className="home-section overflow-hidden" id="rewards">
      <div className="home-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-[#1a0505] px-5 py-10 shadow-[0_30px_80px_rgba(122,12,12,0.22)] sm:rounded-[2.5rem] sm:px-10 sm:py-14 lg:px-14"
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
            <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-amber-200"
              >
                <Star className="h-3 w-3 fill-amber-200 text-amber-200" />
                Dedox Rewards
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="mt-5 max-w-xl font-serif-luxury text-[2rem] leading-[1.15] text-white sm:text-5xl"
              >
                Spend AED {POINTS_PER_UNIT}.
                <span className="block italic text-amber-100/90">Earn a bottle.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base"
              >
                Become a Dedox Rewards member and every qualifying order works for
                you. Spend AED {POINTS_PER_UNIT} and earn 1 point. Orders of AED{" "}
                {MIN_ORDER_TOTAL.toLocaleString()}+ start collecting after delivery.
                Keep shopping, watch your balance grow, and redeem a free premium
                bottle on your next paid order — a gift from the house, not a
                discount code.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-7"
              >
                <Link
                  href={href}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-100 via-white to-amber-50 px-7 py-3.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#7a0c0c] shadow-[0_12px_30px_rgba(251,191,36,0.18)]"
                >
                  <motion.span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
                    animate={{ translateX: ["-120%", "120%"] }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6 }}
                  />
                  <Gift className="relative h-4 w-4" />
                  <span className="relative">
                    {isAuthenticated ? "View my points" : "Join Rewards"}
                  </span>
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.12, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] px-2.5 py-4 text-center backdrop-blur-sm sm:px-3 sm:py-6"
                >
                  <motion.div
                    className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-200 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.55 + idx * 0.12, duration: 0.6 }}
                  />
                  <p className="text-[9px] font-black tracking-[0.22em] text-amber-200/80 sm:text-[10px]">
                    {step.n}
                  </p>
                  <p className="mt-2 font-serif-luxury text-lg text-white sm:text-2xl">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[10px] leading-snug text-white/55 sm:text-xs">
                    {step.text}
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
