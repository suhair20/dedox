"use client";

import { products } from "@/lib/data";
import ProductCard from "./ProductCard";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRICE_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under 500", min: 0, max: 500 },
  { label: "500 - 1000", min: 500, max: 1000 },
  { label: "1000 - 5000", min: 1000, max: 5000 },
  { label: "5000 - 10000", min: 5000, max: 10000 },
  { label: "10000+", min: 10000, max: Infinity },
];

export default function BestSelling() {
  const [activeRange, setActiveRange] = useState(PRICE_RANGES[0]);

const filteredItems = useMemo(() => {
    return products
      .filter((p) => p.price >= activeRange.min && p.price < activeRange.max)
      .slice(0, 10); // This ensures only 10 products show up
  }, [activeRange]);
  return (
    <section className="py-24 bg-[#fafafa]" id="best-selling">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif-luxury text-gray-900 mb-4">Best Selling</h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            The perfumes that define contemporary elegance: powerful, complex, and eternally captivating.
          </p>
        </div>

        {/* Price Filter Chips */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar max-w-full px-4">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => setActiveRange(range)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activeRange.label === range.label
                    ? "bg-[#2E073F] text-white shadow-xl scale-105"
                    : "bg-white text-gray-400 hover:text-gray-900 shadow-sm"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
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
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-serif-luxury text-2xl italic">No products found in this range.</p>
          </div>
        )}
      </div>
    </section>
  );
}
