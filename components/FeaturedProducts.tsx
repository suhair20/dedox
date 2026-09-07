"use client";

import { useProducts } from "@/context/ProductsContext";
import ProductCard from "./ProductCard";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

export default function FeaturedProducts() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.isFeatured);
  const slides =
    featured.length > 0 && featured.length < 4
      ? [...featured, ...featured, ...featured]
      : featured;

  const [emblaRef] = useEmblaCarousel(
    {
      loop: slides.length > 1,
      align: "start",
      dragFree: true,
      duration: 20,
    },
    [
      AutoScroll({
        playOnInit: true,
        speed: 0.85,
        startDelay: 900,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: false,
      }),
    ]
  );

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
    </section>
  );
}
