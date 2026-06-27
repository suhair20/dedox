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
    <section className="bg-white py-24" id="brands">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif-luxury text-4xl text-gray-900 md:text-5xl">
            Shop by Brand
          </h2>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">
            The Curated Selection
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-12 lg:flex-row">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {brands.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
                Mark brands as Featured in Admin to show them here.
              </div>
            ) : (
              brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                  className="group flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#7a0c0c] hover:bg-[#7a0c0c] hover:shadow-xl active:scale-[0.98] md:h-24 md:w-36"
                >
                  {brand.imageUrl ? (
                    <Image
                      src={brand.imageUrl}
                      alt={brand.name}
                      width={120}
                      height={48}
                      unoptimized
                      className="max-h-12 object-contain transition group-hover:brightness-0"
                    />
                  ) : (
                    <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-gray-900 transition-colors duration-300 group-hover:font-black group-hover:text-black md:text-[14px]">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))
            )}
          </div>

          <div className="flex flex-col items-center">
            <Link
              href="/shop"
              className="btn-primary rounded-full px-12 py-4 text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all"
            >
              Explore All Brands
            </Link>
            <p className="mt-4 text-[9px] uppercase tracking-widest text-gray-400">
              The Full Archive
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
