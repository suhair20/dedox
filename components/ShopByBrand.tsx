"use client";

import Link from "next/link";

const brands = [
  { name: "Tom Ford",    logo: "TOM FORD",          subtitle: "" },
  { name: "Roja",        logo: "ROJA",               subtitle: "PARFUMS" },
  { name: "Xerjoff",     logo: "XERJOFF",            subtitle: "" },
  { name: "Ex Nihilo",   logo: "EX NIHILO",          subtitle: "PARIS" },
 
];

export default function ShopByBrand() {
  return (
  <section className="py-6 bg-white" id="brands">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
          Shop by Brand
        </h2>
        <p className="text-gray-500 text-sm">
          Discover your favorite brands
        </p>
      </div>

      {/* Main Row */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        
        {/* Brand Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className=" h-28 md:h-24 w-28 md:w-36 bg-white border shadow-lg rounded-2xl 
                                                          flex items-center justify-center text-center 
                         transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
            >
              <span className="text-lg font-semibold tracking-wide text-gray-900 group-hover:text-[#0f3d3e] transition-colors">
                {brand.logo}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Side Button */}
        <div className="flex flex-col items-center">
          <Link
            href="/shop"
            className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-900 transition"
          >
            View All Brands
          </Link>

          <p className="text-gray-500 text-sm mt-3">
            Browse our complete collection
          </p>
        </div>

      </div>
    </div>
  </section>
);
}
