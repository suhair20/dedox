"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: Truck,
    n: "01",
    title: "Fast Delivery",
    desc: "Swift dispatch from the UAE. Express in 1–2 days.",
    image: "/images/bg-images/image 2.jpg.jpeg",
  },
  {
    icon: ShieldCheck,
    n: "02",
    title: "100% Original",
    desc: "Authentic bottles only. Sealed and guaranteed.",
    image: "/images/bg-images/image 4.jpg.jpeg",
  },
  {
    icon: CreditCard,
    n: "03",
    title: "Secure Payment",
    desc: "Encrypted checkout. Your order stays protected.",
    image: "/images/bg-images/image 5.jpg.jpeg",
  },
];

export default function Features() {
  return (
    <section className="home-section overflow-hidden">
      <div className="home-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="home-section-header"
        >
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#7a0c0c]/70 sm:mb-3 sm:tracking-[0.35em]">
            The Dedox Promise
          </p>
          <h2 className="home-section-title">Crafted to be trusted</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.55 }}
              whileHover={{ y: -8 }}
              className="group relative min-h-[13.5rem] overflow-hidden rounded-2xl px-4 py-5 shadow-[0_18px_50px_rgba(122,12,12,0.12)] sm:min-h-[18rem] sm:rounded-[1.75rem] sm:px-7 sm:py-10"
            >
              <Image
                src={feature.image}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/55" />

              <div className="relative flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-white/15 backdrop-blur-sm sm:h-14 sm:w-14">
                  <feature.icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <span className="font-serif-luxury text-xl text-white/70 sm:text-2xl">
                  {feature.n}
                </span>
              </div>

              <h3 className="relative mt-4 font-serif-luxury text-xl text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)] sm:mt-5 sm:text-2xl">
                {feature.title}
              </h3>
              <p className="relative mt-2 text-[13px] leading-relaxed text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)] sm:text-sm">
                {feature.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
