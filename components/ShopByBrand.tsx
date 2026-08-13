"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { CatalogBrand } from "@/lib/catalogTypes";

export default function ShopByBrand() {
  const [brands, setBrands] = useState<CatalogBrand[]>([]);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        const featured = Array.isArray(data?.brands)
          ? data.brands.filter((brand: CatalogBrand) => brand.isFeatured)
          : [];
        setBrands(featured.slice(0, 4));
      })
      .catch(() => setBrands([]));
  }, []);

  return (
    <section className="home-section" id="brands">
      <div className="home-section-inner">
        <div className="home-section-header">
          <h2 className="home-section-title">Shop by Brand</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500 sm:text-[11px] sm:tracking-[0.4em]">
            The Curated Selection
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 sm:gap-10 lg:flex-row lg:gap-12">
          <div className="grid grid-cols-2 place-items-center gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 md:gap-6">
            {brands.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400 sm:p-8">
                Mark brands as Featured in Admin to show them here.
              </div>
            ) : (
              brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                  className="group flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#7a0c0c] hover:bg-[#7a0c0c] hover:shadow-xl active:scale-[0.98] sm:h-24 sm:w-24 md:h-24 md:w-36"
                >
                  {brand.imageUrl ? (
                    <Image
                      src={brand.imageUrl}
                      alt={brand.name}
                      width={120}
                      height={48}
                      unoptimized
                      className="max-h-12 max-w-[85%] object-contain transition group-hover:brightness-0"
                    />
                  ) : (
                    <span className="px-1 text-[12px] font-bold uppercase tracking-[0.18em] text-gray-900 transition-colors duration-300 group-hover:font-black group-hover:text-black sm:text-[13px] sm:tracking-[0.2em] md:text-[14px]">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))
            )}
          </div>

          <div className="flex flex-col items-center px-2">
            <Link
              href="/shop"
              className="btn-primary max-w-full rounded-full px-6 py-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all sm:px-12 sm:py-4 sm:text-[11px]"
            >
              Explore All Brands
            </Link>
            <p className="mt-3 text-[9px] uppercase tracking-widest text-gray-400 sm:mt-4">
              The Full Archive
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
