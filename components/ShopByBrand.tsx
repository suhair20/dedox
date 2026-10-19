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
        const items = Array.isArray(data?.brands) ? data.brands : [];
        const featured = items.filter((brand: CatalogBrand) => brand.isFeatured);
        const rest = items.filter((brand: CatalogBrand) => !brand.isFeatured);
        setBrands([...featured, ...rest].slice(0, 5));
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
          <p className="home-section-subtitle mt-4">
            Houses we stand behind — the names collectors ask for, chosen for
            character, quality, and the way they wear in this climate. Tap a
            house to see every bottle we hold from that house.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 sm:gap-10">
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
            {brands.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400 sm:p-8">
                Mark brands as Featured in Admin to show them here.
              </div>
            ) : (
              brands.map((brand) => (
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
              ))
            )}
          </div>

          <div className="flex flex-col items-center px-2">
            <Link
              href="/brands"
              className="btn-primary max-w-full rounded-full px-6 py-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all sm:px-12 sm:py-4 sm:text-[11px]"
            >
              Explore All Brands
            </Link>
            <p className="mt-3 max-w-[16rem] text-center text-[11px] leading-relaxed text-gray-400 sm:mt-4">
              See every house we carry — then open that brand in the collection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
