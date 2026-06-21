"use client";

import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { products } = useProducts();
  const filteredProducts = products.filter(
    (p) =>
      p.categorySlug?.toLowerCase() === slug.toLowerCase() ||
      p.category.toLowerCase() === slug.toLowerCase()
  );

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#7a0c0c] mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Collections
        </Link>
        
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-[#7a0c0c] mb-6 tracking-tight capitalize">
            {categoryName} Collection
          </h1>
          <div className="w-24 h-1 bg-[#7a0c0c] mx-auto opacity-20" />
          <p className="mt-8 text-gray-500 max-w-2xl mx-auto text-lg italic">
            Refined fragrances specifically curated for {slug}.
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-10">
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
            <Link href="/" className="btn-primary px-8 py-3 font-bold uppercase tracking-widest transition-colors">
              Explore All
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
