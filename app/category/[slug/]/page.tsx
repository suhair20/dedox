"use client";

import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === slug.toLowerCase()
  );

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#0f3d3e] mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Collections
        </Link>
        
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-[#0f3d3e] mb-6 tracking-tight capitalize">
            {categoryName} Collection
          </h1>
          <div className="w-24 h-1 bg-[#0f3d3e] mx-auto opacity-20" />
          <p className="mt-8 text-gray-500 max-w-2xl mx-auto text-lg italic">
            Refined fragrances specifically curated for {slug}.
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500 text-lg mb-6">No products found in this category.</p>
            <Link href="/" className="bg-[#0f3d3e] text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-black transition-colors">
              Explore All
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
