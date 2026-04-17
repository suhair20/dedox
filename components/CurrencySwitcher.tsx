"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLocation, SUPPORTED_CURRENCIES } from '@/context/LocationContext';
import { ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CurrencySwitcher() {
  const { currency, setCurrencyByCode } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-100 bg-white/50 backdrop-blur-sm hover:border-[#2E073F]/30 transition-all shadow-sm"
      >
        <span className="text-lg leading-none">{currency.flag}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{currency.code}</span>
        <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-[200]"
          >
            <div className="p-3 border-b border-gray-50 bg-gray-50/50">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2E073F]">Select Region</span>
            </div>
            <div className="p-1">
              {Object.values(SUPPORTED_CURRENCIES).map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setCurrencyByCode(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                    currency.code === item.code 
                    ? 'bg-[#2E073F] text-white' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl leading-none">{item.flag}</span>
                    <span className="text-xs font-bold">{item.name}</span>
                  </div>
                  <span className={`text-[10px] font-black ${currency.code === item.code ? 'text-white/70' : 'text-gray-400'}`}>
                    {item.code}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
