"use client";

import { useProducts } from "@/context/ProductsContext";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import type { Product } from "@/lib/data";

function HighlightTrack({ featured }: { featured: Product[] }) {
  // Enough copies so the strip overflows on wide desktops and AutoScroll can run.
  const slides = useMemo(() => {
    const copies = Math.max(4, Math.ceil(16 / featured.length));
    return Array.from({ length: copies }, () => featured).flat();
  }, [featured]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      duration: 20,
    },
    [
      AutoScroll({
        playOnInit: true,
        speed: 0.9,
        startDelay: 400,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnFocusIn: false,
      }),
    ]
  );

  // Resume after drags and after slides change (products load async).
  useEffect(() => {
    if (!emblaApi) return;
    const resume = () => {
      const autoScroll = emblaApi.plugins().autoScroll;
      if (autoScroll && !autoScroll.isPlaying()) autoScroll.play();
    };
    resume();
    emblaApi.on("reInit", resume).on("settle", resume).on("pointerUp", resume);
    return () => {
      emblaApi.off("reInit", resume).off("settle", resume).off("pointerUp", resume);
    };
  }, [emblaApi]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex cursor-grab pl-4 active:cursor-grabbing sm:pl-6 [touch-action:pan-x]">
        {slides.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="min-w-0 shrink-0 grow-0 basis-[9.75rem] pr-3 sm:basis-[200px] sm:pr-4 md:basis-[240px] lg:basis-[260px]"
          >
            <ProductCard product={product} swipeFriendly />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.isFeatured);

  if (featured.length === 0) return null;

  return (
    <section className="home-section" id="featured">
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

      <HighlightTrack featured={featured} />
    </section>
  );
}
