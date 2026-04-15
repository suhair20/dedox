"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { products } from "@/lib/data";

export default function AntigravityCollection() {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <section className="relative w-full py-24 md:py-40 bg-white overflow-hidden">
      {/* Editorial Header Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24 md:mb-40">
        <div className="flex flex-col md:flex-row items-baseline gap-8 md:gap-20">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            className="font-serif-luxury text-7xl md:text-9xl text-gray-900 leading-none"
          >
            Spring <br />
            <span className="italic pl-16 md:pl-32">Release</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-xs"
          >
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              A study in suspension. Our spring collection explores the boundary between weight and lightness, using rare molecular compounds that linger in the air like silken ribbons.
            </p>
            <div className="h-px w-24 bg-gray-900" />
          </motion.div>
        </div>
      </div>

      {/* Hero Visual Section - Overlapping Product */}
      <div className="relative w-full h-[60vh] md:h-[80vh] mb-40">
        <div className="absolute inset-x-0 top-0 h-full w-full grayscale opacity-10 bg-[url('https://www.transparenttextures.com/patterns/silk.png')] pointer-events-none" />
        
        <div className="container mx-auto px-4 h-full relative">
           <motion.div 
             initial={{ opacity: 0, scale: 1.1 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.5 }}
             className="relative h-full w-full rounded-[60px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)]"
           >
              <Image 
                src="/images/antigravity_perfume_bottle_floating_clouds_1776232508651.png"
                alt="Antigravity Showcase"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
              
              <div className="absolute bottom-16 left-16 z-20">
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.8 }}
                   className="glass-card p-10 rounded-3xl text-white border-white/10"
                 >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black opacity-70 mb-2 block">Featured Piece</span>
                    <h3 className="text-4xl md:text-5xl font-serif-luxury mb-4">Oud Royale</h3>
                    <p className="text-sm opacity-80 max-w-sm mb-6">A majestic blend of rare agarwood, suspended in a cloud of violet mist.</p>
                    <button className="text-[10px] uppercase tracking-widest font-black border-b border-white pb-1 hover:opacity-50 transition-opacity">Discover Vessel</button>
                 </motion.div>
              </div>
           </motion.div>
        </div>
      </div>

      {/* The Collection Grid - Broken Grid Style */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-x-12 md:gap-y-32">
           {featuredProducts.map((product, idx) => (
             <motion.div 
               key={product.id}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1, duration: 0.8 }}
               className={`group flex flex-col ${idx % 2 === 1 ? 'md:translate-y-24' : ''}`}
             >
                <div className="relative aspect-[3/4] overflow-hidden mb-8 bg-gray-50 rounded-2xl transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(155,89,182,0.15)]">
                   <div className="absolute inset-0 iridescent-bg opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                   <Image 
                     src={product.image}
                     alt={product.name}
                     fill
                     className="object-cover transition-transform duration-1000 group-hover:scale-110"
                   />
                   
                   {/* Luxury Floating Price Badge */}
                   <div className="absolute top-6 right-6 z-10">
                      <div className="glass-card px-4 py-2 rounded-full shadow-lg">
                         <span className="text-[11px] font-bold text-gray-900">${product.price}</span>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col items-start px-2">
                   <span className="text-[10px] uppercase tracking-widest text-[#9b59b6] font-bold mb-2">{product.brand}</span>
                   <h3 className="text-2xl font-serif-luxury text-gray-900 mb-2 group-hover:tracking-wider transition-all duration-500">{product.name}</h3>
                   <p className="text-gray-400 text-xs mb-6 line-clamp-1">{product.description}</p>
                   <button className="text-[10px] uppercase tracking-[0.2em] font-black group-hover:text-[#9b59b6] transition-colors">
                      View Details &rarr;
                   </button>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
