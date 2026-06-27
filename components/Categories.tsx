"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
    <section className="bg-white py-10 pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="mb-20 text-center">
          <h2 className="mb-6 font-serif-luxury text-4xl text-gray-900 md:text-5xl lg:text-6xl">
            Shop by Category
          </h2>
          <p className="mx-auto max-w-2xl text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">
            Curated collections for the modern vessel.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
            Add categories in Admin and mark them Featured to show here.
          </div>
        ) : (
          <div className="-mx-4 flex gap-8 overflow-x-auto px-4 pb-4 scrollbar-hide md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="flex w-[80vw] flex-shrink-0 flex-col items-center text-center sm:w-[60vw] md:w-auto"
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative mb-6 block aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm"
                >
                  <Image
                    src={cat.imageUrl || FALLBACK_IMAGE}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 80vw, 33vw"
                  />
                </Link>
                <h3 className="mb-3 font-serif-luxury text-3xl text-gray-900">{cat.name}</h3>
                <Link
                  href={`/category/${cat.slug}`}
                  className="btn-primary rounded-full px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all"
                >
                  Shop {cat.name}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
