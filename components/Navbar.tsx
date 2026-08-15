"use client";

import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  ChevronDown,
  X,
  LogOut,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import CurrencySwitcher from "./CurrencySwitcher";

export default function Navbar() {
  const { getCartCount } = useCart();
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const submitSearch = (event?: React.FormEvent) => {
    event?.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setIsMobileMenuOpen(false);
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  const [categories, setCategories] = useState<Array<{ name: string; href: string }>>([]);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data?.categories) ? data.categories : [];
        setCategories(
          items.map((item: { name: string; slug: string }) => ({
            name: item.name,
            href: `/category/${item.slug}`,
          }))
        );
      })
      .catch(() => setCategories([]));
  }, []);

  const accountHref = isAuthenticated ? "/account" : "/login";

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinkClass =
    "font-serif-luxury text-[11px] xl:text-[12px] uppercase tracking-[0.14em] xl:tracking-[0.18em] 2xl:tracking-[0.22em] font-medium text-gray-900 hover:text-[#7a0c0c] transition-colors relative group whitespace-nowrap";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] w-full border-b border-white/20 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-md">
        <div className="container mx-auto grid h-16 min-h-[4rem] grid-cols-[auto_1fr_auto] items-center gap-2 px-3 sm:h-[4.5rem] sm:gap-3 sm:px-4 md:px-6 xl:h-20 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-6">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="shrink-0 rounded-lg p-1.5 text-gray-700 transition-colors hover:text-[#7a0c0c] xl:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <nav className="hidden min-w-0 items-center gap-4 xl:flex xl:gap-5 2xl:gap-7">
              <Link href="/" className={navLinkClass}>
                Discover
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#7a0c0c] transition-all duration-300 group-hover:w-full" />
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setIsShopOpen(true)}
                onMouseLeave={() => setIsShopOpen(false)}
              >
                <Link href="/shop" className={`flex items-center gap-1 ${navLinkClass}`}>
                  Collection
                  <ChevronDown
                    className={`h-3 w-3 transition ${isShopOpen ? "rotate-180" : ""}`}
                  />
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#7a0c0c] transition-all duration-300 group-hover:w-full" />
                </Link>

                <AnimatePresence>
                  {isShopOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 z-50 mt-4 w-56 overflow-hidden rounded-md border bg-white shadow-xl"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7a0c0c]"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      <Link
                        href="/shop"
                        className="block border-t px-5 py-3 text-xs font-bold uppercase text-[#7a0c0c]"
                      >
                        View All Products
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/about" className={navLinkClass}>
                Signature
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#7a0c0c] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link href="/contact" className={navLinkClass}>
                Contact
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#7a0c0c] transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>
          </div>

          {/* Center logo — grid column, not absolute */}
          <div className="flex min-w-0 justify-center px-1 sm:px-2">
            <Logo compact />
          </div>

          {/* Right */}
          <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-2 md:gap-3">
            <form onSubmit={submitSearch} className="hidden min-w-0 xl:block">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search"
                className="w-24 rounded-full border border-gray-200 px-3 py-1.5 text-xs outline-none transition focus:border-[#7a0c0c] xl:w-28 2xl:w-40"
              />
            </form>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="shrink-0 rounded-lg p-1.5 text-gray-700 transition-colors hover:text-[#7a0c0c] xl:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href={accountHref}
              aria-label={loading ? "Account" : isAuthenticated ? "Account" : "Login"}
              className="hidden shrink-0 rounded-lg p-1.5 text-gray-700 transition-colors hover:text-[#7a0c0c] lg:block"
            >
              <User className="h-5 w-5" />
            </Link>

            <div className="shrink-0 scale-[0.88] sm:scale-95 xl:scale-100">
              <CurrencySwitcher />
            </div>

            <div className="relative shrink-0">
              <Link
                href="/cart"
                aria-label="Cart"
                className="block rounded-lg p-1.5 text-[#7a0c0c] transition-colors hover:text-[#981212]"
              >
                <ShoppingBag className="h-5 w-5" />
              </Link>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#7a0c0c] text-[9px] font-bold text-white sm:h-5 sm:w-5 sm:text-[10px]">
                {getCartCount()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/50"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className="fixed top-0 left-0 z-[110] h-full w-[min(85vw,20rem)] overflow-y-auto bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b p-4 sm:p-5">
                <Logo compact />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-gray-700"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={submitSearch} className="border-b p-4 sm:p-5">
                <div className="flex items-center rounded-lg border px-3 py-2">
                  <Search className="h-4 w-4 shrink-0 text-gray-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search products..."
                    className="ml-2 w-full min-w-0 text-sm outline-none"
                  />
                </div>
              </form>

              <div className="flex flex-col space-y-6 p-5 sm:space-y-7 sm:p-6">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="font-medium">
                  Discover
                </Link>

                <div>
                  <p className="mb-4 font-medium">Collections</p>
                  <div className="space-y-4 border-l pl-4">
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
                      className="block pt-2 font-semibold text-[#7a0c0c]"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>

                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-medium">
                  Signature
                </Link>

                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="font-medium">
                  Contact
                </Link>

                <Link
                  href={accountHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 border-t pt-4 font-medium text-[#7a0c0c]"
                >
                  <User className="h-5 w-5" />
                  {isAuthenticated ? "My Account" : "Login / Account"}
                </Link>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 font-medium text-gray-600"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
