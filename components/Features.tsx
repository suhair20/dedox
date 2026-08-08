"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, CreditCard } from "lucide-react";

export default function Features() {
  const features = [
    { icon: Truck, title: "Fast Delivery", desc: "Get your favorite scents delivered swiftly." },
    { icon: ShieldCheck, title: "100% Original", desc: "Guaranteed authentic premium fragrances." },
    { icon: CreditCard, title: "Secure Payment", desc: "Safe and encrypted checkout process." }
  ];

  return (
    <section className="overflow-x-hidden border-t border-gray-50 bg-[#ffffff] py-10 pb-16 sm:py-12 sm:pb-24 md:pb-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile: horizontal drag scroll. Desktop: 3-column grid */}
        <div className="-mx-4 flex gap-6 overflow-x-auto px-4 pb-3 scrollbar-hide divide-y-0 divide-gray-100 sm:gap-10 md:mx-0 md:grid md:grid-cols-3 md:gap-12 md:overflow-visible md:px-0 md:pb-0 md:divide-x">
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="flex w-[min(72vw,18rem)] shrink-0 flex-col items-center px-4 pt-4 text-center sm:w-[50vw] sm:px-6 sm:pt-6 md:w-auto md:px-8 md:pt-0"
            >
              <div className="mb-5 rounded-full border border-white bg-[#FAF9F6] p-4 transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] sm:mb-8 sm:p-6">
                <f.icon className="h-8 w-8 text-[#7a0c0c] opacity-90 sm:h-10 sm:w-10" />
              </div>
              <h3 className="mb-2 text-lg font-bold tracking-tight text-gray-900 sm:mb-4 sm:text-xl">{f.title}</h3>
              <p className="max-w-[280px] text-xs font-medium leading-relaxed text-gray-500 sm:text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
