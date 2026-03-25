"use client";

import { Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function FloatingButtons() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </motion.button>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 z-50 bg-[#0f3d3e] text-white p-4 rounded-full shadow-2xl hover:bg-black hover:scale-110 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#0f3d3e]/30"
        aria-label="Wishlist"
      >
        <Heart className="h-7 w-7" />
        <span className="absolute -top-2 -right-2 bg-white text-[#0f3d3e] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border border-gray-100">
          0
        </span>
      </motion.button>
    </AnimatePresence>
  );
}
