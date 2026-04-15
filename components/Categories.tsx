"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  { 
    name: "Men", 
    image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&q=80&w=800",
    description: "Discover our latest men's collection featuring premium quality and modern style."
  },
  { 
    name: "Women", 
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800",
    description: "Explore our women's collection with elegant designs and contemporary fashion."
  },
  { 
    name: "Unisex", 
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800",
    description: "Browse our unisex collection designed for everyone with versatile and timeless pieces."
  },
];

export default function Categories() {
  return (
    <section className="py-10 pb-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif-luxury text-gray-900 mb-6">Shop by Category</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-[11px] uppercase tracking-[0.4em] font-black">
            Curated collections for the modern vessel.
          </p>
        </div>
        
        {/* Mobile: horizontal draggable scroll. Desktop: 3-column grid */}
        <div className="flex md:grid md:grid-cols-3 gap-8  overflow-x-auto md:overflow-visible scrollbar-hide pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="flex flex-col items-center text-center flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-auto"
            >
              <Link href={`/category/${cat.name.toLowerCase()}`} className="group block relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-sm">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 33vw"
                />
              </Link>
              <h3 className="text-3xl font-serif-luxury text-gray-900 mb-3">{cat.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[280px]">
                {cat.description}
              </p>
              <Link 
                href={`/category/${cat.name.toLowerCase()}`}
                className="bg-[#2E073F] text-white px-10 py-3.5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-purple-900 transition-all shadow-lg"
              >
                Shop {cat.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
