"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import PriceRangeSlider, {
  PRICE_SLIDER_MAX,
  formatAed,
} from "@/components/PriceRangeSlider";

const DEFAULT_PRICE = 300;

export default function ShopByPrice() {
  const [price, setPrice] = useState(DEFAULT_PRICE);

  const atMax = price >= PRICE_SLIDER_MAX;

  const displayValue = useMemo(() => {
    if (atMax) return `${formatAed(PRICE_SLIDER_MAX)}+`;
    return formatAed(price);
  }, [atMax, price]);

  const exploreHref = atMax
    ? `/shop?minPrice=${PRICE_SLIDER_MAX}`
    : `/shop?maxPrice=${price}`;

  return (
    <section className="home-section" id="shop-by-price">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="home-section-header">
          <h2 className="home-section-title uppercase tracking-wide">
            Shop by Price
          </h2>
          <p className="home-section-subtitle">
            Set the most you wish to spend and we will show bottles that fit —
            from an everyday signature to a rare niche piece. All prices are in
            AED. Slide to your range, then explore the collection that matches it.
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <PriceRangeSlider value={price} onChange={setPrice} />

          <p className="mt-2 mb-8 font-serif-luxury text-2xl font-bold text-[#7a0c0c] sm:mb-8 sm:text-3xl">
            {displayValue}
          </p>

          <Link
            href={exploreHref}
            className="group relative mx-auto flex w-full max-w-sm flex-col items-center overflow-hidden rounded-2xl border-2 border-[#7a0c0c]/20 bg-gradient-to-b from-[#7a0c0c]/[0.06] via-white to-white px-6 py-8 text-center shadow-[0_16px_48px_rgba(122,12,12,0.14),0_4px_16px_rgba(15,23,42,0.06)] ring-1 ring-[#7a0c0c]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#7a0c0c]/40 hover:shadow-[0_24px_56px_rgba(122,12,12,0.2),0_8px_24px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#7a0c0c]/10 blur-2xl transition-opacity group-hover:opacity-100" />
            <p className="relative text-sm font-medium text-gray-600 sm:text-base">
              {atMax ? "Fragrances from" : "Fragrances under"}
            </p>
            <p className="relative mt-1 font-serif-luxury text-2xl font-bold text-[#7a0c0c] sm:text-3xl">
              {atMax ? `${formatAed(PRICE_SLIDER_MAX)}+` : formatAed(price)}
            </p>
            <span className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-[#7a0c0c] px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_8px_24px_rgba(122,12,12,0.35)] transition-transform group-hover:scale-105">
              Explore
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
