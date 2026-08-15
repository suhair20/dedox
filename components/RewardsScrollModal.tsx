"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MIN_ORDER_TOTAL, POINTS_PER_UNIT } from "@/lib/loyalty/config";

const DISMISS_KEY = "dedox_rewards_modal_dismissed";
const OPEN_DELAY_MS = 700;

const MIST = [
  { x: -22, delay: 0.1, size: 11, dur: 3.4 },
  { x: -6, delay: 0.45, size: 16, dur: 3.8 },
  { x: 8, delay: 0.2, size: 13, dur: 3.2 },
  { x: 20, delay: 0.7, size: 10, dur: 3.6 },
  { x: -14, delay: 1.1, size: 8, dur: 2.9 },
  { x: 14, delay: 1.4, size: 9, dur: 3.3 },
  { x: 0, delay: 0.9, size: 18, dur: 4.1 },
];

const SPARKS = [
  { x: -28, y: 18, delay: 0.2 },
  { x: 24, y: 8, delay: 0.8 },
  { x: -8, y: -6, delay: 1.4 },
  { x: 16, y: 28, delay: 1.9 },
];

function PerfumeScene() {
  return (
    <div className="relative mx-auto h-36 w-32">
      <motion.div
        className="absolute left-1/2 top-10 h-20 w-20 -translate-x-1/2 rounded-full bg-[#7a0c0c]/15 blur-2xl"
        animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {MIST.map((puff, i) => (
        <motion.span
          key={`mist-${i}`}
          className="absolute left-1/2 top-8 rounded-full bg-[radial-gradient(circle,rgba(255,236,210,0.75)_0%,rgba(122,12,12,0.18)_70%,transparent_100%)]"
          style={{ width: puff.size, height: puff.size, marginLeft: puff.x }}
          animate={{
            y: [20, -18, -52],
            x: [0, i % 2 === 0 ? 8 : -8, i % 2 === 0 ? 14 : -12],
            opacity: [0, 0.85, 0],
            scale: [0.4, 1.2, 1.7],
          }}
          transition={{
            duration: puff.dur,
            delay: puff.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {SPARKS.map((spark, i) => (
        <motion.span
          key={`spark-${i}`}
          className="absolute left-1/2 top-10 h-1 w-1 rounded-full bg-amber-200"
          style={{ marginLeft: spark.x, marginTop: spark.y }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.6, 0.4], y: [0, -10, -16] }}
          transition={{ duration: 2.2, delay: spark.delay, repeat: Infinity }}
        />
      ))}

      <motion.div
        className="absolute left-1/2 top-6 h-10 w-10 -translate-x-1/2 rounded-full bg-amber-100/50 blur-md"
        animate={{ scale: [0.3, 1.6, 0.3], opacity: [0, 0.55, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
      />

      <motion.div
        className="absolute inset-x-0 bottom-0 flex justify-center"
        initial={{ y: 36, opacity: 0, rotate: -8 }}
        animate={{ y: [0, -7, 0], opacity: 1, rotate: [-1.5, 1.5, -1.5] }}
        transition={{
          y: { duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.35 },
          rotate: { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.35 },
          opacity: { duration: 0.55 },
        }}
      >
        <svg width="68" height="100" viewBox="0 0 88 132" fill="none" aria-hidden>
          <motion.rect
            x="36"
            y="8"
            width="16"
            height="10"
            rx="2"
            fill="#2a0a0a"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 220, damping: 16 }}
          />
          <rect x="32" y="16" width="24" height="8" rx="2" fill="#7a0c0c" />
          <path d="M28 28C28 24 32 22 44 22C56 22 60 24 60 28V36H28V28Z" fill="#4a0808" />
          <path
            d="M22 40C22 37 26 36 44 36C62 36 66 37 66 40L70 118C70 124 62 128 44 128C26 128 18 124 18 118L22 40Z"
            fill="url(#dedoxBottleGlass)"
          />
          <motion.path
            d="M28 48C30 46 36 45 44 45C52 45 58 46 60 48C58 70 56 96 54 112C52 116 48 117 44 117C40 117 36 116 34 112C32 96 30 70 28 48Z"
            fill="url(#dedoxBottleJuice)"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <path
            d="M30 52C36 58 52 62 58 54"
            stroke="white"
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <motion.rect
            x="20"
            y="40"
            width="18"
            height="80"
            fill="url(#dedoxShine)"
            opacity="0.35"
            animate={{ x: [20, 48, 20], opacity: [0, 0.45, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          <defs>
            <linearGradient id="dedoxBottleGlass" x1="18" y1="36" x2="70" y2="128" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff7f4" />
              <stop offset="1" stopColor="#f3d6d0" />
            </linearGradient>
            <linearGradient id="dedoxBottleJuice" x1="28" y1="45" x2="60" y2="117" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7a0c0c" />
              <stop offset="0.55" stopColor="#b42323" />
              <stop offset="1" stopColor="#e8a04a" />
            </linearGradient>
            <linearGradient id="dedoxShine" x1="20" y1="40" x2="38" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.5" stopColor="white" stopOpacity="0.85" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

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
    const timer = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
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
        >
          <motion.button
            type="button"
            aria-label="Close rewards promo"
            className="absolute inset-0 bg-[#1a0505]/55 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rewards-modal-title"
            className="relative z-10 w-full max-w-[17rem] overflow-hidden rounded-3xl border border-[#7a0c0c]/10 bg-[#fffaf7] shadow-[0_24px_60px_rgba(26,5,5,0.32)]"
            initial={{ opacity: 0, y: 56, scale: 0.88, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 28, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
          >
            <motion.div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-2.5 top-2.5 z-10 rounded-full bg-white/80 p-1.5 text-gray-500 shadow-sm transition hover:bg-white hover:text-[#7a0c0c]"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="px-4 pb-4 pt-5 text-center">
              <PerfumeScene />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-0.5 text-[9px] font-black uppercase tracking-[0.24em] text-[#7a0c0c]/70"
              >
                Dedox Rewards
              </motion.p>
              <motion.h2
                id="rewards-modal-title"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
                className="mt-1.5 font-serif-luxury text-[1.35rem] leading-tight text-gray-900"
              >
                A bottle that
                <span className="block italic text-[#7a0c0c]">earns itself.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.62 }}
                className="mx-auto mt-2 max-w-[14rem] text-xs leading-relaxed text-gray-500"
              >
                Spend AED {POINTS_PER_UNIT} → 1 point. Orders of AED{" "}
                {MIN_ORDER_TOTAL.toLocaleString()}+ earn after delivery.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
              >
                <Link
                  href={loading ? "/account/rewards" : href}
                  onClick={close}
                  className="relative mt-4 flex w-full items-center justify-center overflow-hidden rounded-full bg-[#7a0c0c] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_10px_22px_rgba(122,12,12,0.28)] transition hover:bg-[#921010]"
                >
                  <motion.span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-120%", "120%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.4 }}
                  />
                  Join Rewards
                </Link>
                <button
                  type="button"
                  onClick={close}
                  className="mt-1.5 w-full py-1.5 text-xs font-medium text-gray-400 transition hover:text-gray-700"
                >
                  Not now
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
