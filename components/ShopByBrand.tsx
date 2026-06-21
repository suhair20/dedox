"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BrandOption = {
  _id: string;
  name: string;
  slug?: string;
  isFeatured?: boolean;
};

const fallbackBrands = [
  { name: "Tom Ford", logo: "TOM FORD" },
  { name: "Roja", logo: "ROJA" },
  { name: "Xerjoff", logo: "XERJOFF" },
  { name: "Ex Nihilo", logo: "EX NIHILO" },
];

export default function ShopByBrand() {
  const [brands, setBrands] = useState(fallbackBrands);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        const featured = Array.isArray(data?.brands)
          ? data.brands.filter((brand: BrandOption) => brand.isFeatured)
          : [];

        if (featured.length > 0) {
          setBrands(
            featured.slice(0, 4).map((brand: BrandOption) => ({
              name: brand.name,
              logo: brand.name.toUpperCase(),
            }))
          );
        }
      })
      .catch(() => {
        setBrands(fallbackBrands);
      });
  }, []);

  return (
    <section className="py-24 bg-white" id="brands">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif-luxury text-gray-900 mb-4">
            Shop by Brand
          </h2>
          <p className="text-gray-500 text-[11px] uppercase tracking-[0.4em] font-black">
            The Curated Selection
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className=" h-28 md:h-24 w-28 md:w-36 bg-white border shadow-lg rounded-2xl 
                           flex items-center justify-center text-center 
                           transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group"
              >
                <span className="text-[14px] font-bold tracking-[0.2em] uppercase text-gray-900 group-hover:text-[#7a0c0c] transition-colors">
                  {brand.logo}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center">
            <Link
              href="/shop"
              className="btn-primary px-12 py-4 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg"
            >
              Explore All Brands
            </Link>

            <p className="text-gray-400 text-[9px] uppercase tracking-widest mt-4">
              The Full Archive
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
