"use client";

import { useProducts } from "@/context/ProductsContext";
import ProductCard from "./ProductCard";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRICE_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "To 500", min: 0, max: 500 },
  { label: "Under 1000", min: 0, max: 1000 },
  { label: "Under 1500", min: 0, max: 1500 },
  { label: "Under 2000", min: 0, max: 2000 },
  { label: "Under 2500", min: 0, max: 2500 },
];

export default function BestSelling() {
  const { products } = useProducts();
  const [activeRange, setActiveRange] = useState(PRICE_RANGES[0]);

  const filteredItems = useMemo(() => {
    return products
      .filter((p) => p.price >= activeRange.min && p.price <= activeRange.max)
      .slice(0, 10);
  }, [activeRange, products]);
  return (
    <section className="bg-[#ffffff] py-10 sm:py-16 md:py-24" id="best-selling">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-12">
          <h2 className="mb-3 font-serif-luxury text-[1.75rem] text-gray-900 sm:mb-4 sm:text-4xl md:text-5xl">
            Best Selling
          </h2>
          <p className="mx-auto max-w-2xl px-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
            The perfumes that define contemporary elegance: powerful, complex, and eternally captivating.
          </p>
        </div>

        {/* Price Filter Chips */}
        <div className="mb-6 flex justify-center sm:mb-12 md:mb-16">
          <div className="no-scrollbar flex w-full max-w-full items-center justify-start gap-2 overflow-x-auto px-1 pb-2 scrollbar-hide sm:justify-center sm:gap-3 sm:px-4 sm:pb-4">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => setActiveRange(range)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-xs ${
                  activeRange.label === range.label
                    ? "btn-primary scale-105 text-white shadow-xl"
                    : "border border-gray-100 bg-white text-gray-400 shadow-sm hover:text-gray-900"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-3 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="min-w-0"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="py-12 text-center sm:py-20">
            <p className="font-serif-luxury text-xl italic text-gray-400 sm:text-2xl">No products found in this range.</p>
          </div>
        )}
      </div>
    </section>
  );
}
