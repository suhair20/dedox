"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, LayoutGrid, List, Search } from "lucide-react";
import { filterProducts } from "@/lib/productFilters";
import { FilterCheckboxGroup, FilterRadioGroup } from "@/components/shop/ShopFilterGroups";
import type { CatalogSnapshot } from "@/lib/catalogTypes";

const emptyCatalog: CatalogSnapshot = {
  categories: [],
  brands: [],
  notes: [],
  accords: [],
  occasions: [],
  concentrations: [],
};

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function ShopPageContent() {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const [catalog, setCatalog] = useState<CatalogSnapshot>(emptyCatalog);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedAccords, setSelectedAccords] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedConcentration, setSelectedConcentration] = useState("");
  const [stockStatus, setStockStatus] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name">("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => setCatalog({ ...emptyCatalog, ...data }))
      .catch(() => setCatalog(emptyCatalog));
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setSelectedBrands(searchParams.get("brand") ? [searchParams.get("brand")!] : []);
    setSelectedCategories(searchParams.get("category") ? [searchParams.get("category")!] : []);
    setSelectedNotes(searchParams.get("note") ? [searchParams.get("note")!] : []);
    setSelectedAccords(searchParams.get("accord") ? [searchParams.get("accord")!] : []);
    setSelectedOccasions(searchParams.get("occasion") ? [searchParams.get("occasion")!] : []);
    setSelectedConcentration(searchParams.get("concentration") || "");
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const base = filterProducts(products, {
      query: searchQuery,
      brand: selectedBrands.length === 1 ? selectedBrands[0] : undefined,
      category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
      note: selectedNotes.length === 1 ? selectedNotes[0] : undefined,
      accord: selectedAccords.length === 1 ? selectedAccords[0] : undefined,
      occasion: selectedOccasions.length === 1 ? selectedOccasions[0] : undefined,
      concentration: selectedConcentration || undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      inStockOnly: stockStatus.includes("in-stock") && stockStatus.length === 1,
      outOfStockOnly: stockStatus.includes("out-of-stock") && stockStatus.length === 1,
      sortBy,
    });

    return base.filter((product) => {
      if (selectedBrands.length > 1 && !selectedBrands.includes(product.brandSlug || product.brand)) {
        return false;
      }
      if (
        selectedCategories.length > 1 &&
        !selectedCategories.includes(product.categorySlug || product.category)
      ) {
        return false;
      }
      if (
        selectedNotes.length > 1 &&
        !selectedNotes.some((slug) => product.notes?.some((note) => note.slug === slug))
      ) {
        return false;
      }
      if (
        selectedAccords.length > 1 &&
        !selectedAccords.some((slug) => product.accords?.some((accord) => accord.slug === slug))
      ) {
        return false;
      }
      if (
        selectedOccasions.length > 1 &&
        !selectedOccasions.some((slug) => product.occasions?.some((occasion) => occasion.slug === slug))
      ) {
        return false;
      }
      return true;
    });
  }, [
    products,
    searchQuery,
    selectedBrands,
    selectedCategories,
    selectedNotes,
    selectedAccords,
    selectedOccasions,
    selectedConcentration,
    stockStatus,
    priceRange,
    sortBy,
  ]);

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedNotes([]);
    setSelectedAccords([]);
    setSelectedOccasions([]);
    setSelectedConcentration("");
    setStockStatus([]);
    setPriceRange({ min: 0, max: 2000 });
  };

  const renderFilters = () => (
    <>
      <div className="mb-10 space-y-4">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-900">Availability</h4>
        <div className="space-y-3">
          {["in-stock", "out-of-stock"].map((status) => (
            <label key={status} className="group flex cursor-pointer items-center space-x-3 text-sm">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 rounded-sm border-gray-300 text-[#7a0c0c] focus:ring-[#7a0c0c]"
                checked={stockStatus.includes(status)}
                onChange={() => setStockStatus((prev) => toggleValue(prev, status))}
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
        selected={selectedBrands}
        onToggle={(slug) => setSelectedBrands((prev) => toggleValue(prev, slug))}
      />
      <FilterCheckboxGroup
        title="Categories"
        options={catalog.categories.map((item) => ({ slug: item.slug, name: item.name }))}
        selected={selectedCategories}
        onToggle={(slug) => setSelectedCategories((prev) => toggleValue(prev, slug))}
      />
      <FilterCheckboxGroup
        title="Notes"
        options={catalog.notes.map((item) => ({ slug: item.slug, name: item.name }))}
        selected={selectedNotes}
        onToggle={(slug) => setSelectedNotes((prev) => toggleValue(prev, slug))}
      />
      <FilterCheckboxGroup
        title="Accords"
        options={catalog.accords.map((item) => ({ slug: item.slug, name: item.name }))}
        selected={selectedAccords}
        onToggle={(slug) => setSelectedAccords((prev) => toggleValue(prev, slug))}
      />
      <FilterCheckboxGroup
        title="Occasions"
        options={catalog.occasions.map((item) => ({ slug: item.slug, name: item.name }))}
        selected={selectedOccasions}
        onToggle={(slug) => setSelectedOccasions((prev) => toggleValue(prev, slug))}
      />
      <FilterRadioGroup
        title="Concentration"
        options={catalog.concentrations.map((item) => ({ slug: item.slug, name: item.name }))}
        selected={selectedConcentration}
        onSelect={setSelectedConcentration}
      />
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif-luxury text-3xl font-bold text-[#7a0c0c]">Shop Collection</h1>
            <p className="mt-2 text-sm text-gray-500">
              {filteredProducts.length} fragrance{filteredProducts.length === 1 ? "" : "s"} found
            </p>
          </div>
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, brand, notes..."
              className="w-full rounded-full border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7a0c0c]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <h3 className="mb-6 flex items-center justify-between border-b border-gray-100 pb-2 text-lg font-bold uppercase tracking-widest text-[#7a0c0c]">
              Filters
              <Filter className="h-4 w-4 opacity-50" />
            </h3>
            {renderFilters()}
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
                  className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
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
              <div className="sticky bottom-0 w-full border-t border-gray-100 bg-white p-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="btn-primary w-full py-4 font-bold uppercase tracking-widest shadow-xl"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7a0c0c]/20 border-t-[#7a0c0c]" />
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}
