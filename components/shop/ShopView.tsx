"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Gift, X, LayoutGrid, List } from "lucide-react";
import { filterProducts } from "@/lib/productFilters";
import { FilterCheckboxGroup, FilterRadioGroup } from "@/components/shop/ShopFilterGroups";
import PriceRangeSlider, {
  PRICE_SLIDER_MAX,
  PRICE_SLIDER_MIN,
  formatAed,
} from "@/components/PriceRangeSlider";
import type { CatalogSnapshot } from "@/lib/catalogTypes";
import {
  clearPendingReward,
  readPendingReward,
  type PendingReward,
} from "@/lib/loyalty/pendingReward";

const emptyCatalog: CatalogSnapshot = {
  categories: [],
  brands: [],
  notes: [],
  accords: [],
  occasions: [],
  concentrations: [],
};

type PriceMode = "all" | "under" | "from";

type ShopFilters = {
  brands: string[];
  categories: string[];
  notes: string[];
  accords: string[];
  occasions: string[];
  concentration: string;
  stockStatus: string[];
  priceValue: number;
  priceMode: PriceMode;
};

const emptyFilters: ShopFilters = {
  brands: [],
  categories: [],
  notes: [],
  accords: [],
  occasions: [],
  concentration: "",
  stockStatus: [],
  priceValue: PRICE_SLIDER_MAX,
  priceMode: "all",
};

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function priceLabel(filters: ShopFilters) {
  if (filters.priceMode === "all") return "All prices";
  if (filters.priceMode === "from") return `${formatAed(PRICE_SLIDER_MAX)}+`;
  return formatAed(filters.priceValue);
}

function ShopPageContent() {
  const { products } = useProducts();
  const { cart } = useCart();
  const [catalog, setCatalog] = useState<CatalogSnapshot>(emptyCatalog);
  const [filters, setFilters] = useState<ShopFilters>(emptyFilters);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name">("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [pendingReward, setPendingReward] = useState<PendingReward | null>(null);
  const [showClaimBanner, setShowClaimBanner] = useState(false);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => setCatalog({ ...emptyCatalog, ...data }))
      .catch(() => setCatalog(emptyCatalog));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("q") || "");

    const fromUrl: ShopFilters = {
      ...emptyFilters,
      brands: params.get("brand") ? [params.get("brand")!] : [],
      categories: params.get("category") ? [params.get("category")!] : [],
      notes: params.get("note") ? [params.get("note")!] : [],
      accords: params.get("accord") ? [params.get("accord")!] : [],
      occasions: params.get("occasion") ? [params.get("occasion")!] : [],
      concentration: params.get("concentration") || "",
    };

    const maxPriceParam = params.get("maxPrice");
    const minPriceParam = params.get("minPrice");
    if (maxPriceParam) {
      const max = Number(maxPriceParam);
      if (!Number.isNaN(max)) {
        const clamped = Math.min(PRICE_SLIDER_MAX, Math.max(PRICE_SLIDER_MIN, max));
        fromUrl.priceValue = clamped;
        fromUrl.priceMode = clamped >= PRICE_SLIDER_MAX ? "from" : "under";
      }
    } else if (minPriceParam && !Number.isNaN(Number(minPriceParam))) {
      fromUrl.priceValue = PRICE_SLIDER_MAX;
      fromUrl.priceMode = "from";
    }

    setFilters(fromUrl);

    const pending = readPendingReward();
    setPendingReward(pending);
    setShowClaimBanner(params.get("claim") === "1" && Boolean(pending));
  }, []);

  const filteredProducts = useMemo(() => {
    const base = filterProducts(products, {
      query: searchQuery,
      brand: filters.brands.length === 1 ? filters.brands[0] : undefined,
      category: filters.categories.length === 1 ? filters.categories[0] : undefined,
      note: filters.notes.length === 1 ? filters.notes[0] : undefined,
      accord: filters.accords.length === 1 ? filters.accords[0] : undefined,
      occasion: filters.occasions.length === 1 ? filters.occasions[0] : undefined,
      concentration: filters.concentration || undefined,
      minPrice: filters.priceMode === "from" ? PRICE_SLIDER_MAX : undefined,
      maxPrice: filters.priceMode === "under" ? filters.priceValue : undefined,
      inStockOnly: filters.stockStatus.includes("in-stock") && filters.stockStatus.length === 1,
      outOfStockOnly: filters.stockStatus.includes("out-of-stock") && filters.stockStatus.length === 1,
      sortBy,
    });

    return base.filter((product) => {
      if (filters.brands.length > 1 && !filters.brands.includes(product.brandSlug || product.brand)) {
        return false;
      }
      if (
        filters.categories.length > 1 &&
        !filters.categories.includes(product.categorySlug || product.category)
      ) {
        return false;
      }
      if (
        filters.notes.length > 1 &&
        !filters.notes.some((slug) => product.notes?.some((note) => note.slug === slug))
      ) {
        return false;
      }
      if (
        filters.accords.length > 1 &&
        !filters.accords.some((slug) => product.accords?.some((accord) => accord.slug === slug))
      ) {
        return false;
      }
      if (
        filters.occasions.length > 1 &&
        !filters.occasions.some((slug) => product.occasions?.some((occasion) => occasion.slug === slug))
      ) {
        return false;
      }
      return true;
    });
  }, [products, searchQuery, filters, sortBy]);

  const clearFilters = () => {
    setFilters(emptyFilters);
  };

  const renderFilters = () => (
    <>
      <div className="mb-10">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-900">Price</h4>
        <PriceRangeSlider
          value={filters.priceValue}
          onChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              priceValue: value,
              priceMode: value >= PRICE_SLIDER_MAX ? "from" : "under",
            }))
          }
        />
        <p className="mt-1 font-serif-luxury text-xl font-bold text-[#7a0c0c]">
          {priceLabel(filters)}
        </p>
      </div>

      <div className="mb-10 space-y-4">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-900">Availability</h4>
        <div className="space-y-3">
          {["in-stock", "out-of-stock"].map((status) => (
            <label key={status} className="group flex cursor-pointer items-center space-x-3 text-sm">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 rounded-sm border-gray-300 text-[#7a0c0c] focus:ring-[#7a0c0c]"
                checked={filters.stockStatus.includes(status)}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    stockStatus: toggleValue(prev.stockStatus, status),
                  }))
                }
              />
              <span className="text-gray-600 transition-colors group-hover:text-black">
                {status === "in-stock" ? "In stock" : "Out of stock"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <FilterCheckboxGroup
        title="Brands"
        options={catalog.brands.map((item) => ({ slug: item.slug, name: item.name }))}
        selected={filters.brands}
        onToggle={(slug) =>
          setFilters((prev) => ({ ...prev, brands: toggleValue(prev.brands, slug) }))
        }
      />
      <FilterCheckboxGroup
        title="Categories"
        options={catalog.categories.map((item) => ({ slug: item.slug, name: item.name }))}
        selected={filters.categories}
        onToggle={(slug) =>
          setFilters((prev) => ({ ...prev, categories: toggleValue(prev.categories, slug) }))
        }
      />
      <FilterCheckboxGroup
        title="Notes"
        options={catalog.notes.map((item) => ({ slug: item.slug, name: item.name }))}
        selected={filters.notes}
        onToggle={(slug) =>
          setFilters((prev) => ({ ...prev, notes: toggleValue(prev.notes, slug) }))
        }
      />
      <FilterCheckboxGroup
        title="Accords"
        options={catalog.accords.map((item) => ({ slug: item.slug, name: item.name }))}
        selected={filters.accords}
        onToggle={(slug) =>
          setFilters((prev) => ({ ...prev, accords: toggleValue(prev.accords, slug) }))
        }
      />
      <FilterCheckboxGroup
        title="Occasions"
        options={catalog.occasions.map((item) => ({ slug: item.slug, name: item.name }))}
        selected={filters.occasions}
        onToggle={(slug) =>
          setFilters((prev) => ({ ...prev, occasions: toggleValue(prev.occasions, slug) }))
        }
      />
      <FilterRadioGroup
        title="Concentration"
        options={catalog.concentrations.map((item) => ({ slug: item.slug, name: item.name }))}
        selected={filters.concentration}
        onSelect={(slug) => setFilters((prev) => ({ ...prev, concentration: slug }))}
      />
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="sr-only">Shop Collection</h1>
        {showClaimBanner && pendingReward ? (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#7a0c0c]/20 bg-[#7a0c0c]/[0.04] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7a0c0c] text-white">
                <Gift className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Add a perfume to claim “{pendingReward.name}”
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Your free gift ({pendingReward.pointsCost} pts) ships only with a paid
                  order. Add any product, then go to checkout.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {cart.length > 0 ? (
                <Link
                  href="/checkout"
                  className="rounded-full bg-[#7a0c0c] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
                >
                  Go to checkout
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setShowClaimBanner(false);
                  clearPendingReward();
                  setPendingReward(null);
                }}
                className="rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-12 lg:flex-row">
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-24">
              {renderFilters()}
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 w-full text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-[#7a0c0c]"
              >
                Clear all
              </button>
            </div>
          </aside>

          <main className="flex-grow">
            <div className="mb-10 flex flex-col items-center justify-between gap-6 border-b border-gray-100 pb-8 sm:flex-row">
              <div className="text-sm font-medium text-gray-500">
                Showing <span className="font-bold text-black">{filteredProducts.length}</span> items
              </div>
              <div className="flex w-full items-center space-x-8 sm:w-auto">
                <div className="hidden items-center space-x-2 border-r border-gray-200 pr-8 md:flex">
                  <button className="rounded-sm bg-gray-50 p-2 text-[#7a0c0c]">
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 transition-colors hover:text-black">
                    <List className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-grow items-center space-x-4 sm:flex-grow-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sort:</span>
                  <select
                    className="cursor-pointer border-none bg-transparent text-sm font-bold text-gray-900 outline-none focus:ring-0"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "featured" | "price-low" | "price-high" | "name")
                    }
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="btn-primary flex items-center space-x-2 rounded-sm px-5 py-2.5 text-sm font-bold uppercase tracking-widest lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-10 md:grid-cols-4"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-sm border border-dashed border-gray-200 bg-gray-50 py-32 text-center"
                >
                  <p className="mb-6 text-lg italic text-gray-400">No products match your current filters.</p>
                  <button
                    onClick={clearFilters}
                    className="font-bold text-[#7a0c0c] underline underline-offset-4 hover:no-underline"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[101] h-full w-[85%] max-w-sm overflow-y-auto bg-white shadow-2xl lg:hidden"
            >
              <div className="p-8">
                <div className="mb-10 flex items-center justify-between border-b border-gray-100 pb-6">
                  <h2 className="font-serif text-2xl font-bold text-[#7a0c0c]">Filters</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="rounded-full border border-gray-100 p-2 transition-colors hover:bg-gray-50"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                {renderFilters()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopView() {
  return <ShopPageContent />;
}
