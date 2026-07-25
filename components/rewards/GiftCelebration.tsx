"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Sparkles, Star } from "lucide-react";

type GiftCelebrationProps = {
  active: boolean;
  intensity?: "small" | "full";
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotate: number;
  delay: number;
  kind: "dot" | "star";
};

const COLORS = ["#7a0c0c", "#a31212", "#f59e0b", "#fbbf24", "#fde68a", "#ffffff"];

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => {
    const angle = (Math.PI * 2 * id) / count + (Math.random() - 0.5) * 0.4;
    const distance = 80 + Math.random() * (count > 24 ? 220 : 120);
    return {
      id,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 20,
      size: 4 + Math.random() * (count > 24 ? 8 : 5),
      color: COLORS[id % COLORS.length],
      rotate: Math.random() * 360,
      delay: Math.random() * 0.12,
      kind: id % 4 === 0 ? "star" : "dot",
    };
  });
}

export default function GiftCelebration({
  active,
  intensity = "small",
  title = "Gift unlocked!",
  subtitle,
  onComplete,
}: GiftCelebrationProps) {
  const isFull = intensity === "full";
  const particles = useMemo(
    () => buildParticles(isFull ? 42 : 18),
    // Rebuild only when intensity / activation changes so each show feels fresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active, intensity]
  );

  useEffect(() => {
    if (!active) return;
    const ms = isFull ? 3200 : 1200;
    const timer = window.setTimeout(() => onComplete?.(), ms);
    return () => window.clearTimeout(timer);
  }, [active, isFull, onComplete]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key={`celebrate-${intensity}`}
          className={
            isFull
              ? "pointer-events-none fixed inset-0 z-[200] flex items-center justify-center"
              : "pointer-events-none absolute inset-0 z-50 overflow-hidden"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isFull ? (
            <motion.div
              className="absolute inset-0 bg-[#1a0a0a]/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          ) : null}

          <div className="relative flex h-full w-full items-center justify-center">
            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute left-1/2 top-1/2"
                style={{ marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: [1, 1, 0],
                  scale: [0.4, 1.15, 0.7],
                  rotate: p.rotate,
                }}
                transition={{
                  duration: isFull ? 1.8 : 1.05,
                  delay: p.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {p.kind === "star" ? (
                  <Star
                    className="fill-current"
                    style={{ width: p.size + 4, height: p.size + 4, color: p.color }}
                  />
                ) : (
                  <span
                    className="block rounded-full"
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                    }}
                  />
                )}
              </motion.span>
            ))}

            {isFull ? (
              <motion.div
                className="relative z-10 mx-4 max-w-sm rounded-[28px] border border-white/15 bg-gradient-to-br from-[#7a0c0c] via-[#9a1818] to-[#4a0606] px-7 py-8 text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                initial={{ scale: 0.7, y: 24, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              >
                <motion.div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-[#4a0606]"
                  animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                >
                  <Gift className="h-8 w-8" />
                </motion.div>
                <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">
                  <Sparkles className="h-3 w-3" />
                  Dedox Rewards
                </div>
                <h2 className="font-serif-luxury text-3xl font-bold tracking-tight">
                  {title}
                </h2>
                {subtitle ? (
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    {subtitle}
                  </p>
                ) : null}
              </motion.div>
            ) : (
              <motion.div
                className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#7a0c0c] text-white shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 1.1 }}
              >
                <Gift className="h-6 w-6" />
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
