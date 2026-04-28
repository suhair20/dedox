"use client";

import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  ChevronDown,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import CurrencySwitcher from "./CurrencySwitcher";

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
      {/* HEADER */}
      <header className="sticky top-0 z-[100] w-full border-b border-white/20 glass-card bg-white/90 backdrop-blur-md">
        <div className="container mx-auto relative flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* LEFT SIDE */}
          <div className="flex flex-1 items-center">
            {/* Mobile Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-gray-700 hover:text-[#2E073F]"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-10 ml-4">
              <Link
                href="/"
                className="font-serif-luxury text-[13px] uppercase tracking-[0.3em] font-medium text-gray-900 hover:text-[#2E073F] transition-colors relative group"
              >
                Discover
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#2E073F] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Collections */}
              <div
                className="relative"
                onMouseEnter={() => setIsShopOpen(true)}
                onMouseLeave={() => setIsShopOpen(false)}
              >
                <Link
                  href="/shop"
                  className="flex items-center gap-1 font-serif-luxury text-[13px] uppercase tracking-[0.3em] text-gray-900 hover:text-[#2E073F] transition-colors relative group"
                >
                  Collection
                  <ChevronDown
                    className={`h-3 w-3 transition ${
                      isShopOpen ? "rotate-180" : ""
                    }`}
                  />
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#2E073F] transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <AnimatePresence>
                  {isShopOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-4 w-56 bg-white border shadow-xl rounded-md overflow-hidden"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2E073F]"
                        >
                          {cat.name}
                        </Link>
                      ))}

                      <Link
                        href="/shop"
                        className="block px-5 py-3 text-xs font-bold uppercase text-[#2E073F] border-t"
                      >
                        View All Products
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/about"
                className="font-serif-luxury text-[13px] uppercase tracking-[0.3em] font-medium text-gray-900 hover:text-[#2E073F] transition-colors relative group"
              >
                Signature
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#2E073F] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link
                href="/contact"
                className="font-serif-luxury text-[13px] uppercase tracking-[0.3em] font-medium text-gray-900 hover:text-[#2E073F] transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#2E073F] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>

          {/* PERFECT CENTER LOGO */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Logo />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-1 items-center justify-end gap-3 sm:gap-5">
            
            {/* Desktop Search */}
            <button className="hidden lg:block text-gray-700 hover:text-[#2E073F]">
              <Search className="h-5 w-5" />
            </button>

            {/* Desktop Login */}
            <Link
              href="/login"
              className="hidden lg:block text-gray-700 hover:text-[#2E073F]"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Currency always visible */}
            <div className="scale-90 sm:scale-100">
              <CurrencySwitcher />
            </div>

            {/* Cart */}
            <div className="relative">
              <Link
                href="/cart"
                className="text-gray-700 hover:text-[#2E073F]"
              >
                <ShoppingBag className="h-5 w-5" />
              </Link>

              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2E073F] text-[10px] text-white font-bold">
                {getCartCount()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className="fixed top-0 left-0 w-[85vw] max-w-sm h-full bg-white z-[110] shadow-2xl overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b">
                <Logo />

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Search */}
              <div className="p-5 border-b">
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="ml-2 w-full outline-none text-sm"
                  />
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col p-6 space-y-7">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  Discover
                </Link>

                <div>
                  <p className="mb-4 font-medium">Collections</p>

                  <div className="pl-4 border-l space-y-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-gray-600"
                      >
                        {cat.name}
                      </Link>
                    ))}

                    <Link
                      href="/shop"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-[#2E073F] font-semibold pt-2"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>

                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                  Signature
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                {/* Login inside mobile menu */}
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-[#2E073F] font-medium pt-4 border-t"
                >
                  <User className="h-5 w-5" />
                  Login / Account
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}