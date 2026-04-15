"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const INGREDIENTS = [
  { name: "Oud", type: "Base Note", desc: "Rare agarwood, harvested from the heart of the forest.", alignment: "left" },
  { name: "Iris", type: "Heart Note", desc: "Velvety botanical powder, distilled over six years.", alignment: "right" },
  { name: "Saffron", type: "Top Note", desc: "The red gold of fragrances, luminous and warm.", alignment: "left" }
];

export default function AntigravityIngredients() {
  return (
    <section className="relative w-full min-h-screen py-24 md:py-32 iridescent-bg overflow-hidden flex items-center justify-center">
      {/* Background Floating Elements */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-24 w-[600px] h-[600px] bg-[#E8DAEF] blur-[120px] rounded-full opacity-40 pointer-events-none" 
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 -left-24 w-[500px] h-[500px] bg-[#D6EAF8] blur-[100px] rounded-full opacity-30 pointer-events-none" 
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          
          {/* Main Visual - Broken Grid Styled */}
          <div className="w-full md:w-1/2 relative">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 50 }}
               whileInView={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 1.2, ease: "easeOut" }}
               className="relative z-10"
             >
                <div className="relative aspect-[4/5] w-full overflow-hidden glass-card rounded-[40px] shadow-2xl">
                   <Image 
                     src="/images/antigravity_ingredients_glass_elements_1776232549985.png"
                     alt="Floating Ingredients"
                     fill
                     className="object-cover scale-110"
                   />
                </div>
                {/* Floating "Silk" effect overlay */}
                <div className="absolute inset-x-0 -bottom-12 h-64 bg-gradient-to-t from-white via-white/5 to-transparent z-20" />
             </motion.div>

             {/* Small secondary floating card */}
             <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:block"
             >
                <div className="glass-card p-8 rounded-3xl shadow-xl w-64 backdrop-blur-2xl">
                   <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#9b59b6] mb-2">Molecular Design</p>
                   <h4 className="font-serif-luxury text-2xl text-gray-900 leading-tight">Synthetic Ethereality</h4>
                </div>
             </motion.div>
          </div>

          {/* Content - Editorial Asymmetrical Side */}
          <div className="w-full md:w-1/2">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-block text-[11px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-6"
            >
              The Ingredients
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-serif-luxury text-6xl md:text-8xl lg:text-9xl text-gray-900 leading-[0.9] mb-12"
            >
              Flora <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200 ml-12">In Air</span>
            </motion.h2>

            <div className="space-y-12 pl-4 border-l border-gray-100">
               {INGREDIENTS.map((item, idx) => (
                 <motion.div 
                   key={item.name}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 + (idx * 0.1) }}
                   className="group cursor-default"
                 >
                    <span className="text-[10px] uppercase tracking-widest text-[#9b59b6] font-bold mb-2 block">{item.type}</span>
                    <h3 className="text-3xl font-serif-luxury text-gray-900 mb-3 group-hover:translate-x-4 transition-transform duration-500">{item.name}</h3>
                    <p className="text-gray-500 max-w-sm text-sm leading-relaxed">{item.desc}</p>
                 </motion.div>
               ))}
            </div>

            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="mt-16"
            >
               <button className="group relative px-10 py-4 overflow-hidden border border-gray-900 rounded-full transition-all hover:border-transparent">
                  <div className="absolute inset-0 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                  <span className="relative z-10 text-[11px] uppercase tracking-[0.3em] font-black group-hover:text-white transition-colors">Explore Science</span>
               </button>
            </motion.div>
          </div>

        </div>
      </div>
      
      {/* Editorial Watermark */}
      <div className="absolute bottom-12 right-12 hidden md:block">
         <p className="text-[9px] uppercase tracking-[0.8em] font-black text-gray-200 rotate-90 origin-right">Antigravity Collection 2026</p>
      </div>
    </section>
  );
}
