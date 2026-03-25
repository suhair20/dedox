"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[500px] w-full bg-black overflow-hidden flex items-center justify-center">
      {/* Background Image overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=2000')" }}
      />
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-block px-4 py-1.5 mb-2 border border-white/30 text-xs md:text-sm font-bold tracking-[0.2em] text-white uppercase backdrop-blur-sm"
          >
            Up to 40% OFF
          </motion.span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
            Exclusive Fragrance <br className="hidden md:block"/> Collection
          </h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pt-8"
          >
            <button className="bg-white text-[#0f3d3e] py-4 px-10 font-bold uppercase tracking-wider hover:bg-[#0f3d3e] hover:text-white transition-all duration-300 shadow-xl text-sm md:text-base border border-transparent hover:border-white">
              Shop Now
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
