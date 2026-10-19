"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import PriceRangeSlider, { PRICE_SLIDER_MAX } from "@/components/PriceRangeSlider";
import { useLocation } from "@/context/LocationContext";

const DEFAULT_PRICE = 300;
const PRICE_BACKGROUND = "/images/bg-images/image 1.jpg.jpeg";
const PRICE_BACKGROUND_FALLBACK = "/images/herosection/lap website design.jpg.jpeg";

export default function ShopByPrice() {
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const [backgroundSrc, setBackgroundSrc] = useState(PRICE_BACKGROUND);
  const { formatPrice } = useLocation();

  const atMax = price >= PRICE_SLIDER_MAX;

  const displayValue = useMemo(() => {
    if (atMax) return `${formatPrice(PRICE_SLIDER_MAX)}+`;
    return formatPrice(price);
  }, [atMax, price, formatPrice]);

  const exploreHref = atMax
    ? `/shop?minPrice=${PRICE_SLIDER_MAX}`
    : `/shop?maxPrice=${price}`;

  return (
    <section className="home-section" id="shop-by-price">
      <div className="home-section-inner">
        <h2 className="text-red-highlight mb-4 text-left font-serif-luxury text-[1.35rem] uppercase leading-tight tracking-wide sm:mb-5 sm:text-4xl lg:text-5xl">
          Shop by Price
        </h2>

        <div className="relative flex min-h-[20rem] w-full flex-col justify-between overflow-hidden rounded-[1.75rem] px-5 py-8 shadow-[0_16px_40px_rgba(122,12,12,0.18)] sm:min-h-[24rem] sm:px-8 sm:py-10 lg:min-h-[28rem] lg:px-12 lg:py-12">
          <Image
            src={backgroundSrc}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-cover object-center"
            onError={() => setBackgroundSrc(PRICE_BACKGROUND_FALLBACK)}
          />

          <p className="relative max-w-xl text-left text-[0.8125rem] leading-relaxed text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)] sm:text-base">
            Set the most you wish to spend and we will show bottles that fit —
            from an everyday signature to a rare niche piece. Slide to your
            range, then explore the collection that matches it.
          </p>

          <div className="relative mt-8">
            <PriceRangeSlider value={price} onChange={setPrice} light />

            <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
                  {atMax ? "Fragrances from" : "Fragrances under"}
                </p>
                <p className="mt-1 font-serif-luxury text-3xl font-bold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)] sm:text-4xl">
                  {displayValue}
                </p>
              </div>

              <Link
                href={exploreHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#7a0c0c] shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
              >
                Explore
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
