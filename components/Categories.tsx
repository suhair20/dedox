"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { CatalogCategory } from "@/lib/catalogTypes";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800";

export default function Categories() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data?.categories) ? data.categories : [];
        const featured = items.filter((item: CatalogCategory) => item.isFeatured);
        setCategories((featured.length ? featured : items).slice(0, 3));
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <section className="home-section overflow-x-hidden">
      <div className="home-section-inner">
        <div className="home-section-header">
          <h2 className="home-section-title">Shop by Category</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500 sm:text-[11px] sm:tracking-[0.4em]">
            Curated collections for the modern vessel
          </p>
          <p className="home-section-subtitle mt-4">
            Start with who will wear it. Men, women, and unisex — each
            collection is edited so you can move quickly from a first impression
            to a bottle you will actually finish.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400 sm:p-12">
            Add categories in Admin and mark them Featured to show here.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 sm:gap-5 md:gap-8">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.12)] sm:rounded-[1.5rem] md:rounded-[1.75rem]"
                  >
                    <Image
                      src={cat.imageUrl || FALLBACK_IMAGE}
                      alt={cat.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 32vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4 md:p-5">
                      <h3 className="font-serif-luxury text-[13px] leading-tight text-white sm:text-2xl md:text-3xl">
                        {cat.name}
                      </h3>
                      <span className="mt-1 hidden items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 sm:mt-2 sm:inline-flex sm:text-[11px]">
                        Shop
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center sm:mt-8">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#7a0c0c] sm:text-[11px]"
              >
                View all collections
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
