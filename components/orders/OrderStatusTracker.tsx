"use client";

import { motion } from "framer-motion";
import { Check, Clock, Package, Truck, XCircle } from "lucide-react";
import {
  ORDER_TRACKER_STEPS,
  getStatusProgressIndex,
} from "@/lib/orders/display";

type OrderStatusTrackerProps = {
  status: string;
  animateKey?: number;
};

const stepIcons = [Clock, Package, Truck, Check];

const MOBILE_LABELS = ["Placed", "Prep", "Shipped", "Done"];

export default function OrderStatusTracker({
  status,
  animateKey = 0,
}: OrderStatusTrackerProps) {
  const normalized = status?.toLowerCase() ?? "pending";

  if (normalized === "cancelled") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center sm:rounded-[28px] sm:p-8"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 sm:h-16 sm:w-16">
          <XCircle className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>
        <p className="text-base font-bold text-red-700 sm:text-lg">Order Cancelled</p>
        <p className="mt-2 text-sm text-red-600/80">
          This order is no longer active. Contact support if you need help.
        </p>
      </motion.div>
    );
  }

  const activeIndex = getStatusProgressIndex(normalized);
  const progressScale =
    activeIndex <= 0 ? 0 : activeIndex / (ORDER_TRACKER_STEPS.length - 1);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-8">
      <div className="relative px-0 sm:px-10">
        <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[18px] h-0.5 bg-gray-100 sm:top-6 sm:h-1">
          <motion.div
            key={`progress-${animateKey}-${activeIndex}`}
            className="h-full origin-left rounded-full bg-[#7a0c0c]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progressScale }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-4">
          {ORDER_TRACKER_STEPS.map((step, index) => {
            const isComplete = index < activeIndex;
            const isCurrent = index === activeIndex;
            const isUpcoming = index > activeIndex;
            const Icon = stepIcons[index] ?? Clock;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative z-10 flex min-w-0 flex-col items-center text-center"
              >
                <div className="relative mb-2 sm:mb-4">
                  {isCurrent && (
                    <motion.span
                      key={`pulse-${animateKey}-${step.key}`}
                      className="absolute inset-0 rounded-full bg-[#7a0c0c]/20"
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}

                  <motion.div
                    key={`node-${animateKey}-${step.key}`}
                    initial={isCurrent ? { scale: 0.7 } : false}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors sm:h-12 sm:w-12 ${
                      isComplete
                        ? "border-[#7a0c0c] bg-[#7a0c0c] text-white"
                        : isCurrent
                          ? "border-[#7a0c0c] bg-white text-[#7a0c0c] shadow-[0_0_0_4px_rgba(122,12,12,0.12)] sm:shadow-[0_0_0_6px_rgba(122,12,12,0.12)]"
                          : "border-gray-200 bg-white text-gray-300"
                    }`}
                  >
                    {isComplete ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 16 }}
                      >
                        <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.div>
                    ) : (
                      <Icon
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${isUpcoming ? "opacity-50" : ""}`}
                      />
                    )}
                  </motion.div>
                </div>

                <p
                  className={`text-[9px] font-black uppercase leading-tight tracking-[0.12em] sm:text-[11px] sm:tracking-[0.22em] ${
                    isCurrent || isComplete ? "text-[#7a0c0c]" : "text-gray-400"
                  }`}
                >
                  <span className="sm:hidden">{MOBILE_LABELS[index]}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </p>
                <p
                  className={`mt-1 hidden text-xs leading-5 sm:mt-2 sm:block ${
                    isCurrent ? "font-medium text-gray-700" : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
