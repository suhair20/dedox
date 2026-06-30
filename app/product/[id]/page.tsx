"use client";

import { useProducts } from "@/context/ProductsContext";
import Image from "next/image";
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  CheckCircle2,

} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { motion, AnimatePresence } from "framer-motion";
import AttributeChipList from "@/components/catalog/AttributeChipList";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { formatPrice } = useLocation();
  
  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnails = product?.thumbnails?.length
    ? product.thumbnails
    : [product?.image || ""];
  const mainImage = thumbnails[selectedImageIndex] || product?.image || "";

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <div className="w-8 h-8 border-4 border-[#7a0c0c]/20 border-t-[#7a0c0c] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4 font-serif-luxury">Product Not Found</h1>
        <Link href="/" className="text-[#7a0c0c] hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fafafa] min-h-screen pt-8 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#7a0c0c] transition-colors">
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-20">
          
          {/* Left Column: Visuals */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 lg:self-start">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square w-full overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] sm:rounded-[32px]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${product.id}-${selectedImageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-4 sm:p-8"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              
              {product.oldPrice && (
                <div className="absolute left-4 top-4 z-10 rounded-full bg-[#7a0c0c] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg sm:left-6 sm:top-6 sm:px-4 sm:py-2">
                  Special Offer
                </div>
              )}
            </motion.div>

            {/* Thumbnail Gallery */}
            {thumbnails.length > 1 && (
              <div className="-mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mt-6 sm:flex-wrap sm:overflow-visible">
                {thumbnails.map((thumb, idx) => (
                  <button
                    key={`${product.id}-thumb-${idx}`}
                    type="button"
                    aria-label={`View image ${idx + 1}`}
                    aria-pressed={selectedImageIndex === idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 w-20 shrink-0 snap-start overflow-hidden rounded-2xl border-2 transition-all duration-200 touch-manipulation sm:h-24 sm:w-24 ${
                      selectedImageIndex === idx
                        ? "border-[#7a0c0c] shadow-md"
                        : "border-gray-200 opacity-70 hover:border-gray-300 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={thumb}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      unoptimized
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information */}
          <div className="relative z-0 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-5 sm:rounded-3xl sm:border sm:border-gray-100 sm:p-8 sm:shadow-sm lg:bg-transparent lg:p-0 lg:shadow-none"
            >
              {/* Product Category/Badge */}
              <div className="mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7a0c0c]/70">
                  DE DOX CERTIFIED PRODUCT
                </span>
              </div>

              {/* Title & Brand */}
              <div className="mb-4">
                <h1 className="mb-2 font-serif-luxury text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                  {product.name}
                </h1>
                <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                  By {product.brand} • {product.category}
                </p>
              </div>

              {/* Ratings */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-[#7a0c0c] text-white px-2.5 py-1 rounded flex items-center space-x-1.5 shadow-sm">
                  <span className="text-sm font-black">{product.rating || 4.8}</span>
                  <Star className="h-3.5 w-3.5 fill-white" />
                </div>
                <button className="text-[12px] font-bold text-[#7a0c0c] hover:underline decoration-2 underline-offset-4">
                  {product.reviewCount || 24} Verified Reviews
                </button>
              </div>

              {/* Subtitle */}
              <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed italic">
                {product.subtitle || "Authentically sourced, premium luxury fragrance."}
              </p>

              {/* Pricing */}
              <div className="mb-8 sm:mb-10">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-3xl font-bold text-[#7a0c0c] sm:text-5xl">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-xl text-gray-300 line-through font-medium leading-none">{formatPrice(product.oldPrice)}</span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Inclusive of all taxes</p>
              </div>

              {/* Info Boxes */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                  <Truck className="h-6 w-6 text-[#7a0c0c] mb-2 opacity-80" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">Delivery</span>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">{product.deliveryInfo || "Free to UAE"}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-[#7a0c0c] mb-2 opacity-80" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">Warranty</span>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">{product.warrantyInfo || "Original Batch"}</p>
                </div>
              </div>

              {/* Fragrance profile */}
              <div className="mb-12 space-y-6 rounded-3xl border border-gray-50 bg-white p-8 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-1.5 rounded-full bg-[#7a0c0c]" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">
                    Fragrance Profile
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <AttributeChipList
                    title="Brand"
                    items={
                      product.brandSlug
                        ? [{ id: product.brandId || product.brand, name: product.brand, slug: product.brandSlug }]
                        : [{ id: product.brand, name: product.brand, slug: product.brand.toLowerCase().replace(/\s+/g, "-") }]
                    }
                    shopParam="brand"
                  />
                  <AttributeChipList
                    title="Category"
                    items={
                      product.categorySlug
                        ? [{ id: product.categoryId || product.category, name: product.category, slug: product.categorySlug }]
                        : [{ id: product.category, name: product.category, slug: product.category.toLowerCase() }]
                    }
                    shopParam="category"
                  />
                  <AttributeChipList title="Notes" items={product.notes} shopParam="note" />
                  <AttributeChipList title="Accords" items={product.accords} shopParam="accord" />
                  <AttributeChipList title="Occasions" items={product.occasions} shopParam="occasion" />
                  <AttributeChipList
                    title="Concentration"
                    items={product.concentration ? [product.concentration] : []}
                    shopParam="concentration"
                  />
                </div>
              </div>

              {/* Call to Action */}
              <div className="space-y-4 mb-12">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">Quantity</span>
                  <div className="flex items-center bg-gray-100 rounded-full h-10 px-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => addToCart(product, quantity)}
                  disabled={!product.inStock}
                  className={`w-full btn-primary h-16 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 shadow-[0_20px_40px_rgba(122,12,12,0.15)] ${
                    !product.inStock 
                    ? 'opacity-50 cursor-not-allowed grayscale' 
                    : 'hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-bold uppercase tracking-widest text-sm">
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </span>
                </button>
              </div>

              {/* Dedox Assurance Checklist */}
              <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-1.5 h-6 bg-[#7a0c0c] rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Dedox Assurance</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 group">
                    <CheckCircle2 className="h-5 w-5 text-[#7a0c0c] mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] font-medium text-gray-600 leading-tight">
                      Secure Checkout with Encrypted Payment Processing
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <CheckCircle2 className="h-5 w-5 text-[#7a0c0c] mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] font-medium text-gray-600 leading-tight">
                      100% Original Batch Sourced Directly from Distributors
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <CheckCircle2 className="h-5 w-5 text-[#7a0c0c] mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] font-medium text-gray-600 leading-tight">
                      Verified Authenticity Seal & Quality Checked Packaging
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <CheckCircle2 className="h-5 w-5 text-[#7a0c0c] mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] font-medium text-gray-600 leading-tight">
                      No Hidden Charges or Import Duties at Checkout
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
