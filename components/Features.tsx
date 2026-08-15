"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: Truck,
    n: "01",
    title: "Fast Delivery",
    desc: "Swift dispatch from the UAE. Express in 1–2 days.",
  },
  {
    icon: ShieldCheck,
    n: "02",
    title: "100% Original",
    desc: "Authentic bottles only. Sealed and guaranteed.",
  },
  {
    icon: CreditCard,
    n: "03",
    title: "Secure Payment",
    desc: "Encrypted checkout. Your order stays protected.",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  return (
    <article className="group relative h-full overflow-hidden rounded-[1.75rem] border border-[#7a0c0c]/10 bg-gradient-to-b from-[#fffaf8] to-white px-6 py-8 shadow-[0_18px_50px_rgba(122,12,12,0.08)] sm:px-7 sm:py-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7a0c0c]/40 to-transparent" />
      <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#7a0c0c]/[0.06] blur-2xl" />

      <div className="flex items-start justify-between">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#7a0c0c]/10 bg-white shadow-[0_10px_24px_rgba(122,12,12,0.1)]"
        >
          <feature.icon className="h-6 w-6 text-[#7a0c0c]" />
        </motion.div>
        <span className="font-serif-luxury text-2xl text-[#7a0c0c]/20">{feature.n}</span>
      </div>

      <h3 className="mt-5 font-serif-luxury text-2xl text-gray-900">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.desc}</p>
      <div className="mt-5 h-px w-10 bg-[#7a0c0c]/20" />
    </article>
  );
}

export default function Features() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (next: number) => {
    setDirection(next > active || (active === features.length - 1 && next === 0) ? 1 : -1);
    setActive((next + features.length) % features.length);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDirection(1);
      setActive((current) => (current + 1) % features.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="home-section overflow-hidden">
      <div className="home-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="home-section-header"
        >
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-[#7a0c0c]/70">
            The Dedox Promise
          </p>
          <h2 className="home-section-title">Crafted to be trusted</h2>
        </motion.div>

        <div className="hidden gap-5 md:grid md:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.55 }}
              whileHover={{ y: -8 }}
            >
              <FeatureCard feature={feature} index={idx} />
            </motion.div>
          ))}
        </div>

        <div className="md:hidden">
          <div
            className="relative min-h-[15.5rem] overflow-hidden"
            onTouchStart={(e) => {
              const startX = e.changedTouches[0].clientX;
              const handleEnd = (endEvent: TouchEvent) => {
                const walk = endEvent.changedTouches[0].clientX - startX;
                if (walk < -40) goTo(active + 1);
                if (walk > 40) goTo(active - 1);
                window.removeEventListener("touchend", handleEnd);
              };
              window.addEventListener("touchend", handleEnd, { once: true });
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={features[active].title}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 72 : -72 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -72 : 72 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <FeatureCard feature={features[active]} index={active} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {features.map((feature, idx) => (
              <button
                key={feature.title}
                type="button"
                aria-label={feature.title}
                onClick={() => goTo(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === active ? "w-7 bg-[#7a0c0c]" : "w-2 bg-[#7a0c0c]/25"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
