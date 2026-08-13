"use client";

import { useProducts } from "@/context/ProductsContext";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { useRef, useState } from "react";

export default function FeaturedProducts() {
  const { products } = useProducts();
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
    <section className="home-section overflow-x-hidden" id="featured">
      <div className="home-section-header home-section-inner">
        <h2 className="home-section-title">The Highlight</h2>
        <p className="mb-5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 sm:mb-6 sm:text-[11px]">
          Curated pieces from the void
        </p>
        <Link href="/shop" className="group relative inline-block overflow-hidden pb-1 text-[10px] font-black uppercase tracking-widest text-[#7a0c0c]">
          <span>View all collection</span>
          <div className="absolute bottom-0 left-0 h-0.5 w-full -translate-x-full bg-[#7a0c0c] transition-transform duration-500 group-hover:translate-x-0" />
        </Link>
      </div>

      <div
        ref={containerRef}
        className="cursor-grab select-none overflow-x-auto bg-[#ffffff] scrollbar-hide"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { setIsPaused(false); handleMouseUp(); }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          ref={trackRef}
          className="flex gap-3 bg-[#ffffff] px-4 py-1 sm:gap-4 sm:px-6"
          style={{
            animation: `marquee ${featured.length * 3}s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {displayProducts.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className="w-[9.75rem] shrink-0 sm:w-[200px] md:w-[240px] lg:w-[260px]"
            >
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
