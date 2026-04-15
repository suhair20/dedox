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
    <section className="py-12 pb-32 bg-white border-t border-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: horizontal drag scroll. Desktop: 3-column grid */}
        <div className="flex md:grid md:grid-cols-3 gap-12 overflow-x-auto md:overflow-visible scrollbar-hide pb-4 md:pb-0 divide-y-0 md:divide-x divide-gray-100 -mx-4 px-4 md:mx-0 md:px-0">
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="flex flex-col items-center text-center px-8 pt-8 md:pt-0 flex-shrink-0 w-[80vw] sm:w-[50vw] md:w-auto"
            >
              <div className="bg-[#FAF9F6] p-6 rounded-full mb-8 transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-white">
                <f.icon className="h-10 w-10 text-[#2E073F] opacity-90" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{f.title}</h3>
              <p className="text-sm text-gray-500 max-w-[280px] leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
