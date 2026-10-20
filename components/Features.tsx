"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

const features: Array<{
  icon: LucideIcon;
  n: string;
  title: string;
  desc: string;
  image: string;
}> = [
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

function FeatureCard({
  feature,
  tall,
}: {
  feature: (typeof features)[number];
  tall?: boolean;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl px-4 py-5 shadow-[0_18px_50px_rgba(122,12,12,0.12)] sm:rounded-[1.75rem] sm:px-7 sm:py-10 ${
        tall ? "min-h-[16.5rem]" : "min-h-[13.5rem] sm:min-h-[18rem]"
      }`}
    >
      <Image
        src={feature.image}
        alt=""
        fill
        unoptimized
        sizes="(max-width: 768px) 90vw, 33vw"
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
    </article>
  );
}

export default function Features() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    duration: 14,
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 1800);
    return () => window.clearInterval(id);
  }, [emblaApi]);

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

        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="-ml-3 flex touch-pan-y [touch-action:pan-x]">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="min-w-0 shrink-0 grow-0 basis-[86%] pl-3"
                >
                  <FeatureCard feature={feature} tall />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            {features.map((feature, idx) => (
              <button
                key={feature.title}
                type="button"
                aria-label={`Show ${feature.title}`}
                onClick={() => emblaApi?.scrollTo(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  selected === idx ? "w-5 bg-[#7a0c0c]" : "w-1.5 bg-[#7a0c0c]/30"
                }`}
              />
            ))}
          </div>
        </div>

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
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
