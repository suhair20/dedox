"use client";

import { products } from "@/lib/data";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { useRef, useState } from "react";

export default function FeaturedProducts() {
  const featured = products.filter(p => p.isFeatured);
  // Duplicate for seamless infinite loop
  const displayProducts = [...featured, ...featured];

  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    dragStartX.current = e.pageX - (containerRef.current?.offsetLeft ?? 0);
    dragScrollLeft.current = containerRef.current?.scrollLeft ?? 0;
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.offsetLeft ?? 0);
    const walk = (x - dragStartX.current) * 2;
    containerRef.current.scrollLeft = dragScrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
    if (containerRef.current) containerRef.current.style.cursor = "grab";
  };

  return (
    <section className="py-20 bg-white" id="featured">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl md:text-3xl font-serif font-bold text-[#0f3d3e] mb-2">Featured</h2>
        <p className="text-gray-400 text-xs md:text-sm mb-4">Explore our hand-picked collection</p>
        <Link href="/shop" className="text-xs font-bold text-gray-900 border-b border-gray-900 pb-0.5 hover:text-[#0f3d3e] hover:border-[#0f3d3e] transition-colors">
          View all
        </Link>
      </div>

      <div
        ref={containerRef}
        className="overflow-x-auto scrollbar-hide cursor-grab select-none"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { setIsPaused(false); handleMouseUp(); }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          ref={trackRef}
          className="flex gap-4 px-4"
          style={{
            animation: `marquee ${featured.length * 3}s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {displayProducts.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="w-[260px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
