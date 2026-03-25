"use client";

import { useState, useMemo } from "react";
import { products, Product } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X,LayoutGrid, List } from "lucide-react";

export default function ShopPage() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [stockStatus, setStockStatus] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const allBrands = useMemo(() => Array.from(new Set(products.map(p => p.brand))).sort(), []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const stockMatch = stockStatus.length === 0 || 
                         (stockStatus.includes("in-stock") && product.inStock) ||
                         (stockStatus.includes("out-of-stock") && !product.inStock);
      const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max;
      
      return brandMatch && stockMatch && priceMatch;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0; // featured/default
    });
  }, [selectedBrands, stockStatus, priceRange, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleStock = (status: string) => {
    setStockStatus(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-12">
            <div>
              <h3 className="text-lg font-bold text-[#0f3d3e] uppercase tracking-widest mb-6 border-b border-gray-100 pb-2 flex items-center justify-between">
                Filters
                <Filter className="h-4 w-4 opacity-50" />
              </h3>
              
              {/* Availability */}
              <div className="space-y-6 mb-10">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Availability</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer group text-sm">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 text-[#0f3d3e] border-gray-300 focus:ring-[#0f3d3e] rounded-sm"
                      checked={stockStatus.includes("in-stock")}
                      onChange={() => toggleStock("in-stock")}
                    />
                    <span className="text-gray-600 group-hover:text-black transition-colors">In stock</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group text-sm">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 text-[#0f3d3e] border-gray-300 focus:ring-[#0f3d3e] rounded-sm"
                      checked={stockStatus.includes("out-of-stock")}
                      onChange={() => toggleStock("out-of-stock")}
                    />
                    <span className="text-gray-600 group-hover:text-black transition-colors">Out of stock</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-6 mb-10">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Price</h4>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 focus:border-[#0f3d3e] outline-none transition-colors"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    />
                  </div>
                  <span className="text-gray-300">to</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                    <input 
                      type="number" 
                      placeholder="2000"
                      className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 focus:border-[#0f3d3e] outline-none transition-colors"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Brands</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {allBrands.map(brand => (
                    <label key={brand} className="flex items-center space-x-3 cursor-pointer group text-sm">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-[#0f3d3e] border-gray-300 focus:ring-[#0f3d3e] rounded-sm"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      <span className="text-gray-600 group-hover:text-black transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Grid Content */}
          <main className="flex-grow">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6 border-b border-gray-100 pb-8">
              <div className="text-sm font-medium text-gray-500">
                Showing <span className="text-black font-bold">{filteredProducts.length}</span> items
              </div>
              
              <div className="flex items-center space-x-8 w-full sm:w-auto">
                <div className="flex items-center space-x-2 border-r border-gray-200 pr-8 hidden md:flex">
                  <button className="p-2 text-[#0f3d3e] bg-gray-50 rounded-sm"><LayoutGrid className="h-4 w-4" /></button>
                  <button className="p-2 text-gray-400 hover:text-black transition-colors"><List className="h-4 w-4" /></button>
                </div>
                
                <div className="flex items-center space-x-4 flex-grow sm:flex-grow-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sort:</span>
                  <select 
                    className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer border-none focus:ring-0"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>

                {/* Mobile Filter Toggle */}
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center space-x-2 bg-black text-white px-5 py-2.5 rounded-sm text-sm font-bold uppercase tracking-widest active:scale-95 transition-transform"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-10"
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
                  className="text-center py-32 bg-gray-50 border border-dashed border-gray-200 rounded-sm"
                >
                  <p className="text-gray-400 text-lg italic mb-6">No products match your current filters.</p>
                  <button 
                    onClick={() => {
                      setSelectedBrands([]);
                      setStockStatus([]);
                      setPriceRange({ min: 0, max: 2000 });
                    }}
                    className="text-[#0f3d3e] font-bold underline hover:no-underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Side Filter Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[101] shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
                  <h2 className="text-2xl font-serif font-bold text-[#0f3d3e]">Filters</h2>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors">
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-12 pb-12">
                  {/* Reuse Filter Components for Mobile */}
                  {/* Availability */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-50 pb-2">Availability</h4>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-4 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 border-gray-300 text-[#0f3d3e] focus:ring-[#0f3d3e]"
                          checked={stockStatus.includes("in-stock")}
                          onChange={() => toggleStock("in-stock")}
                        />
                        <span className="text-gray-600 font-medium">In stock</span>
                      </label>
                      <label className="flex items-center space-x-4 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 border-gray-300 text-[#0f3d3e] focus:ring-[#0f3d3e]"
                          checked={stockStatus.includes("out-of-stock")}
                          onChange={() => toggleStock("out-of-stock")}
                        />
                        <span className="text-gray-600 font-medium">Out of stock</span>
                      </label>
                    </div>
                  </div>

                  {/* Brands */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-50 pb-2">Brands</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {allBrands.map(brand => (
                        <label key={brand} className="flex items-center space-x-4 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 border-gray-300 text-[#0f3d3e] focus:ring-[#0f3d3e]"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                          />
                          <span className="text-gray-600 font-medium text-sm">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 left-0 w-full p-8 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-[#0f3d3e] text-white py-4 font-bold uppercase tracking-widest shadow-xl"
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
