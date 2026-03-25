"use client";

import Link from "next/link";
import { Search, User, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { getCartCount } = useCart();
  const [isShopOpen, setIsShopOpen] = useState(false);

  const categories = [
    { name: "Men", href: "/category/men" },
    { name: "Women", href: "/category/women" },
    { name: "Unisex", href: "/category/unisex" },
    { name: "Luxury", href: "/category/luxury" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu */}
        <div className="flex items-center lg:hidden">
          <button className="text-gray-600 hover:text-[#0f3d3e] transition-colors">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex-1 flex justify-center lg:flex-none lg:justify-start">
          <Link href="/" className="text-3xl font-bold text-[#0f3d3e] tracking-tighter hover:opacity-90 transition-opacity font-serif">
           Dedox           </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:space-x-10">
          <Link href="/" className="text-sm font-medium tracking-widest text-gray-800 hover:text-[#0f3d3e] transition-colors">Home</Link>
          
          <div 
            className="relative group"
            onMouseEnter={() => setIsShopOpen(true)}
            onMouseLeave={() => setIsShopOpen(false)}
          >
            <Link 
              href="/shop" 
              className="flex items-center space-x-1 text-sm   tracking-widest text-gray-800 hover:text-[#0f3d3e] transition-colors py-8"
            >
              <span>Shop</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`} />
            </Link>

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

          <Link href="/about" className=" font-medium     text-gray-800 hover:text-[#0f3d3e] transition-colors">About Us</Link>
          <Link href="/contact" className="text-sm font-medium text-gray-800 hover:text-[#0f3d3e] transition-colors">Contact</Link>
          <Link href="/request-perfume" className="text-sm font-medium  text-gray-800 hover:text-[#0f3d3e] transition-colors">Request a Perfume</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center justify-end space-x-5 lg:space-x-7">
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
    </header>
  );
}
