"use client";

import Link from "next/link";
import { Search, User, ShoppingBag, Menu, ChevronDown, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

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
    <>
      <header className="sticky top-0 z-[100] w-full border-b border-white/20 glass-card transition-all duration-300">
        <div className="absolute inset-0 iridescent-bg opacity-30 -z-10" />
        <div className="container mx-auto flex h-14 sm:h-20 md:h-22 lg:h-26 items-center justify-between px-4 sm:px-6 lg:px-8">
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
            <nav className="hidden lg:flex items-center space-x-12 ml-6">
              <Link href="/" className="group relative flex flex-col h-[22px] overflow-hidden font-inter text-[12px] uppercase tracking-[0.25em] font-medium text-gray-900">
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:-translate-y-full">Discover</span>
                <span className="absolute top-0 left-0 h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover:translate-y-0 text-[#2E073F] font-bold">Discover</span>
              </Link>

              <div
                className="relative group"
                onMouseEnter={() => setIsShopOpen(true)}
                onMouseLeave={() => setIsShopOpen(false)}
              >
                  <Link
                    href="/shop"
                    className="group/link relative flex h-[22px] overflow-hidden items-center font-inter text-[12px] uppercase tracking-[0.25em] font-medium text-gray-900"
                  >
                    <span className="flex items-center space-x-2 transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover/link:-translate-y-full">
                      <span>Collections</span>
                      <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`} />
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full flex items-center space-x-2 transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover/link:translate-y-0 text-[#2E073F] font-bold">
                      <span>Collections</span>
                      <ChevronDown className={`h-3 w-3 text-[#2E073F] transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`} />
                    </span>
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


              <Link href="/about" className="group relative flex flex-col h-[22px] overflow-hidden font-inter text-[12px] uppercase tracking-[0.25em] font-medium text-gray-900">
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:-translate-y-full">Signature</span>
                <span className="absolute top-0 left-0 h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover:translate-y-0 text-[#2E073F] font-bold">Signature</span>
              </Link>
              <Link href="/contact" className="group relative flex flex-col h-[22px] overflow-hidden font-inter text-[12px] uppercase tracking-[0.25em] font-medium text-gray-900">
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:-translate-y-full">Contact</span>
                <span className="absolute top-0 left-0 h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover:translate-y-0 text-[#2E073F] font-bold">Contact</span>
              </Link>

            </nav>
          </div>


          <Logo />







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
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2E073F] text-[10px] font-bold text-white shadow-lg border-2 border-white">
                {getCartCount()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-sm"
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl z-[110] lg:hidden flex flex-col overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo  className="scale-75 -ml-8" />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-[#2E073F] transition-colors"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col px-6 py-8 space-y-8 flex-grow">
                <Link href="/" className="text-gray-900 text-xl font-medium font-inter tracking-wide" onClick={() => setIsMobileMenuOpen(false)}>Discover</Link>

                <div className="flex flex-col">
                  <span className="text-gray-900 text-xl font-medium font-inter tracking-wide mb-6">Collections</span>
                  <div className="pl-6 flex flex-col space-y-6 border-l-2 border-[#2E073F]/20 ml-2">
                    {categories.map((cat) => (
                      <Link key={cat.name} href={cat.href} className="text-gray-500 text-lg font-inter hover:text-[#2E073F] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        {cat.name}
                      </Link>
                    ))}
                    <div className="pt-4 mt-2 border-t border-gray-100 w-3/4">
                      <Link href="/shop" className="text-[#2E073F] text-lg font-bold font-inter flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
                        View All Products <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <Link href="/about" className="text-gray-900 text-xl font-medium font-inter tracking-wide" onClick={() => setIsMobileMenuOpen(false)}>Signature</Link>
                <Link href="/contact" className="text-gray-900 text-xl font-medium font-inter tracking-wide" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
