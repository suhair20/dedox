"use client";

import { products } from "@/lib/data";
import ProductCard from "./ProductCard";

export default function BestSelling() {
  // Show all products in the grid
  const items = products;

  return (
    <section className="py-14 bg-white" id="best-selling">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-3xl font-bold text-black mb-3">Best Selling</h2>
          <p className="text-gray-500 text-sm md:text-base">
            The perfumes that define taste: elegant, powerful, and eternally captivating.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
