"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { CatalogBrand } from "@/lib/catalogTypes";

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
    <div className="min-h-screen bg-white pb-24 pt-8 sm:pt-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-[#7a0c0c]"
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          Back to home
        </Link>

        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <h1 className="mb-3 font-serif-luxury text-[clamp(1.6rem,5vw,2.75rem)] leading-tight text-gray-900">
            All Brands
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500">
            Every house we carry
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
            Browse the full list of fragrance houses. Tap a brand to open the
            collection filtered to that house only.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7a0c0c]/20 border-t-[#7a0c0c]" />
          </div>
        ) : brands.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">
            No brands available yet. Add brands in Admin to show them here.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                className="group flex min-h-[7.5rem] flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#7a0c0c]/40 hover:shadow-[0_16px_40px_rgba(122,12,12,0.12)] sm:min-h-[9rem] sm:p-6"
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
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-gray-900 transition-colors group-hover:text-[#7a0c0c] sm:text-base">
                    {brand.name}
                  </span>
                )}
                {brand.imageUrl ? (
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500 transition-colors group-hover:text-[#7a0c0c] sm:text-[11px]">
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
