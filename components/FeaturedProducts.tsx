"use client";

import { useProducts } from "@/context/ProductsContext";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function FeaturedProducts() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.isFeatured);

  const containerRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const dragMoved = useRef(false);

  const copyCount = Math.max(3, featured.length > 0 && featured.length < 6 ? 4 : 3);
  const sets = Array.from({ length: copyCount }, (_, i) => i);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || featured.length === 0) return;

    const loopWidth = () => firstSetRef.current?.offsetWidth ?? 0;

    const wrap = () => {
      const width = loopWidth();
      if (width <= 0) return 0;

      let delta = 0;
      // Stay in the middle copy so both forward and reverse can wrap.
      while (container.scrollLeft < width) {
        container.scrollLeft += width;
        delta += width;
      }
      while (container.scrollLeft >= width * 2) {
        container.scrollLeft -= width;
        delta -= width;
      }
      return delta;
    };

    const startInMiddle = () => {
      const width = loopWidth();
      if (width > 0) container.scrollLeft = width;
    };

    startInMiddle();
    const startTimer = window.setTimeout(startInMiddle, 50);

    let raf = 0;
    let last = performance.now();
    const PX_PER_SEC = 38;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 48) / 1000;
      last = now;

      if (!pausedRef.current && !draggingRef.current) {
        container.scrollLeft += PX_PER_SEC * dt;
      }

      const delta = wrap();
      if (draggingRef.current && delta !== 0) {
        dragScrollLeft.current += delta;
      }

      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const walk = e.clientX - dragStartX.current;
      if (Math.abs(walk) > 4) dragMoved.current = true;
      container.scrollLeft = dragScrollLeft.current - walk;
      const delta = wrap();
      if (delta !== 0) dragScrollLeft.current += delta;
    };

    const onPointerUp = () => {
      draggingRef.current = false;
      pausedRef.current = false;
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [featured.length]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current || e.pointerType === "touch") {
      pausedRef.current = true;
      return;
    }
    draggingRef.current = true;
    pausedRef.current = true;
    dragMoved.current = false;
    dragStartX.current = e.clientX;
    dragScrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (dragMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved.current = false;
    }
  };

  if (featured.length === 0) return null;

  const cardClass = "w-[9.75rem] shrink-0 sm:w-[200px] md:w-[240px] lg:w-[260px]";

  return (
    <section className="home-section overflow-x-hidden" id="featured">
      <div className="home-section-header home-section-inner">
        <h2 className="home-section-title">The Highlight</h2>
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 sm:text-[11px]">
          Curated pieces from the void
        </p>
        <p className="home-section-subtitle mb-5 sm:mb-6">
          A moving edit of the bottles we are proudest to place in your hands —
          rare, current, and chosen for presence. Drag either way to browse;
          tap a card to read the story and add it to your cart.
        </p>
        <Link href="/shop" className="group relative inline-block overflow-hidden pb-1 text-[10px] font-black uppercase tracking-widest text-[#7a0c0c]">
          <span>View all collection</span>
          <div className="absolute bottom-0 left-0 h-0.5 w-full -translate-x-full bg-[#7a0c0c] transition-transform duration-500 group-hover:translate-x-0" />
        </Link>
      </div>

      <div
        ref={containerRef}
        className="cursor-grab select-none overflow-x-auto bg-[#ffffff] scrollbar-hide active:cursor-grabbing"
        style={{ scrollBehavior: "auto", WebkitOverflowScrolling: "touch" }}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          if (!draggingRef.current) pausedRef.current = false;
        }}
        onPointerDown={handlePointerDown}
        onTouchStart={() => {
          pausedRef.current = true;
        }}
        onTouchEnd={() => {
          pausedRef.current = false;
        }}
        onClickCapture={handleClickCapture}
      >
        <div className="flex w-max pl-4 sm:pl-6">
          {sets.map((setIndex) => (
            <div
              key={setIndex}
              ref={setIndex === 0 ? firstSetRef : undefined}
              className="flex gap-3 py-1 pr-3 sm:gap-4 sm:pr-4"
              aria-hidden={setIndex > 0}
            >
              {featured.map((product) => (
                <div key={`${product.id}-${setIndex}`} className={cardClass}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
