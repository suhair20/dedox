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
    <section className="py-6 pb-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: horizontal drag scroll. Desktop: 3-column grid */}
        <div className="flex md:grid md:grid-cols-3 gap-10 overflow-x-auto md:overflow-visible scrollbar-hide pb-4 md:pb-0 divide-y-0 md:divide-x divide-gray-100 -mx-4 px-4 md:mx-0 md:px-0">
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="flex flex-col items-center text-center px-4 pt-6 md:pt-0 flex-shrink-0 w-[70vw] sm:w-[50vw] md:w-auto"
            >
              <div className="bg-[#f0f4f4] p-5 rounded-full mb-6 transition-transform duration-300 hover:-translate-y-2 hover:shadow-md">
                <f.icon className="h-10 w-10 text-[#0f3d3e]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{f.title}</h3>
              <p className="text-base text-gray-500 max-w-[280px] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
