"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { CatalogBrand } from "@/lib/catalogTypes";

const BRANDS_HERO = "/images/herosection/website banner.jpg (3).jpeg";

export default function BrandsView() {
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data?.brands) ? data.brands : [];
        setBrands(
          [...items].sort((a: CatalogBrand, b: CatalogBrand) =>
            a.name.localeCompare(b.name)
          )
        );
      })
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#faf6f5] pb-8">
      <section className="relative w-full overflow-hidden bg-[#3a0a0c]">
        <div className="relative aspect-[16/7] w-full min-h-[16rem] sm:min-h-[20rem] lg:aspect-[21/8] lg:min-h-[26rem]">
          <Image
            src={BRANDS_HERO}
            alt="Dedox perfume houses"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#7a0c0c]/70 transition-colors hover:text-[#7a0c0c]"
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          Back to home
        </Link>

        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-red-highlight mb-2 font-serif-luxury text-[1.6rem] leading-tight sm:text-4xl lg:text-5xl">
            All Brands
          </h1>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-[#7a0c0c]/60">
            Every house we carry
          </p>
          <p className="home-section-subtitle">
            Browse the full list of fragrance houses. Tap a brand to open the
            collection filtered to that house only.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7a0c0c]/20 border-t-[#7a0c0c]" />
          </div>
        ) : brands.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#7a0c0c]/20 bg-white/70 p-10 text-center text-sm text-[#7a0c0c]/50">
            No brands available yet. Add brands in Admin to show them here.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                className="group flex min-h-[7.5rem] flex-col items-center justify-center gap-3 rounded-2xl border border-[#7a0c0c]/10 bg-white p-4 text-center shadow-[0_8px_24px_rgba(122,12,12,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7a0c0c]/40 hover:shadow-[0_16px_40px_rgba(122,12,12,0.14)] sm:min-h-[9rem] sm:p-6"
              >
                {brand.imageUrl ? (
                  <Image
                    src={brand.imageUrl}
                    alt={brand.name}
                    width={140}
                    height={56}
                    unoptimized
                    className="max-h-12 max-w-full object-contain sm:max-h-14"
                  />
                ) : (
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#7a0c0c] transition-colors group-hover:text-[#981212] sm:text-base">
                    {brand.name}
                  </span>
                )}
                {brand.imageUrl ? (
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a0c0c]/70 transition-colors group-hover:text-[#7a0c0c] sm:text-[11px]">
                    {brand.name}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
