"use client";

import Link from "next/link";
import { Search, User, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { getCartCount } = useCart();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { name: "Men", href: "/category/men" },
    { name: "Women", href: "/category/women" },
    { name: "Unisex", href: "/category/unisex" },
    { name: "Luxury", href: "/category/luxury" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-12 sm:h-16 md:h-18 lg:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Mobile Menu & Nav Links */}
        <div className="flex flex-1 items-center justify-start">
          <div className="lg:hidden">
            <button 
              className="text-gray-600 hover:text-[#0f3d3e] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-10 ml-6">
            <Link href="/" className="group relative flex flex-col h-[22px] overflow-hidden font-inter text-[15px] font-medium text-gray-800">
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:-translate-y-full">Discover</span>
              <span className="absolute top-0 left-0 h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover:translate-y-0 text-transparent bg-clip-text bg-gradient-to-tr from-[#145a5b] to-blue-950 font-semibold">Discover</span>
            </Link>
          
          <div 
            className="relative group"
            onMouseEnter={() => setIsShopOpen(true)}
            onMouseLeave={() => setIsShopOpen(false)}
          >
            <div className="py-6">
              <Link 
                href="/shop" 
                className="group/link relative flex h-[22px] overflow-hidden items-center font-inter text-[15px] font-medium text-gray-800"
              >
                <span className="flex items-center space-x-1 transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover/link:-translate-y-full">
                  <span>Collections</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`} />
                </span>
                <span className="absolute top-0 left-0 w-full h-full flex items-center space-x-1 transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover/link:translate-y-0 text-transparent bg-clip-text bg-gradient-to-tr from-[#145a5b] to-blue-950 font-semibold">
                  <span>Collections</span>
                  <ChevronDown className={`h-4 w-4 text-[#145a5b] transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`} />
                </span>
              </Link>
            </div>

            <AnimatePresence>
              {isShopOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-0 w-56 bg-white border border-gray-100 shadow-2xl py-4 z-50 rounded-sm"
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="block px-6 py-3 text-sm font-medium text-gray-600 hover:text-[#0f3d3e] hover:bg-gray-50 transition-all border-l-2 border-transparent hover:border-[#0f3d3e]"
                    >
                      {cat.name} Collections
                    </Link>
                  ))}
                  <div className="mt-2 pt-2 border-t border-gray-50">
                    <Link
                      href="/shop"
                      className="block px-6 py-3 text-xs font-bold uppercase tracking-tighter text-[#0f3d3e] hover:underline"
                    >
                      View All Products
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/about" className="group relative flex flex-col h-[22px] overflow-hidden font-inter text-[15px] font-medium text-gray-800">
            <span className="transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:-translate-y-full">Signature</span>
            <span className="absolute top-0 left-0 h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover:translate-y-0 text-transparent bg-clip-text bg-gradient-to-tr from-[#145a5b] to-blue-950 font-semibold">Signature</span>
          </Link>
          <Link href="/contact" className="group relative flex flex-col h-[22px] overflow-hidden font-inter text-[15px] font-medium text-gray-800">
            <span className="transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:-translate-y-full">Contact</span>
            <span className="absolute top-0 left-0 h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover:translate-y-0 text-transparent bg-clip-text bg-gradient-to-tr from-[#145a5b] to-blue-950 font-semibold">Contact</span>
          </Link>

          </nav>
        </div>

        {/* Center Section: Logo */}
        <div className="flex flex-none justify-center">
          <Link href="/" className="text-2xl lg:text-4xl font-bold text-[#0f3d3e]  hover:opacity-80 transition-opacity font-serif uppercase tracking-wide">
            Dedox
          </Link>
        </div>

        {/* Right Section: Icons */}
        <div className="flex flex-1 items-center justify-end space-x-5 lg:space-x-7">
          <button className="text-gray-700 hover:text-[#0f3d3e] transition-colors scale-110">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/login" className="hidden sm:block text-gray-700 hover:text-[#0f3d3e] transition-colors scale-110">
            <User className="h-5 w-5" />
          </Link>
          <div className="relative">
            <Link href="/cart" className="text-gray-700 hover:text-[#0f3d3e] transition-colors scale-110">
              <ShoppingBag className="h-5 w-5" />
            </Link>
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0f3d3e] text-[10px] font-bold text-white shadow-lg border-2 border-white">
              {getCartCount()}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-white overflow-hidden shadow-inner"
          >
            <div className="flex flex-col px-6 py-4 space-y-6">
              <Link href="/" className="text-gray-800 text-lg font-medium font-inter" onClick={() => setIsMobileMenuOpen(false)}>Discover</Link>
              <div className="flex flex-col space-y-3">
                <span className="text-gray-800 text-lg font-medium font-inter">Collections</span>
                <div className="pl-4 flex flex-col space-y-3 border-l-2 border-gray-100 ml-2">
                  {categories.map((cat) => (
                    <Link key={cat.name} href={cat.href} className="text-gray-600 font-medium font-inter" onClick={() => setIsMobileMenuOpen(false)}>
                      {cat.name}
                    </Link>
                  ))}
                  <Link href="/shop" className="text-[#0f3d3e] font-bold font-inter pt-1" onClick={() => setIsMobileMenuOpen(false)}>
                    View All Products
                  </Link>
                </div>
              </div>
              <Link href="/about" className="text-gray-800 text-lg font-medium font-inter" onClick={() => setIsMobileMenuOpen(false)}>Signature</Link>
              <Link href="/contact" className="text-gray-800 text-lg font-medium font-inter" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
