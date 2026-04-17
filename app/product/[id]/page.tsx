"use client";

import { products } from "@/lib/data";
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { formatPrice } = useLocation();
  
  // Gallery state
  const [mainImage, setMainImage] = useState(product?.image || "");
  const thumbnails = product?.thumbnails || [product?.image || ""];

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4 font-serif-luxury">Product Not Found</h1>
        <Link href="/" className="text-[#2E073F] hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fafafa] min-h-screen pt-8 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#2E073F] transition-colors">
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">
          
          {/* Left Column: Visuals */}
          <div className="lg:col-span-7 sticky top-28">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] aspect-square relative group"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              
              {product.oldPrice && (
                <div className="absolute top-6 left-6 bg-[#2E073F] text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg z-10 uppercase tracking-widest">
                  Special Offer
                </div>
              )}
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="mt-6 flex flex-wrap gap-4 px-2">
              {thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(thumb)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    mainImage === thumb 
                    ? 'border-[#2E073F] scale-105 shadow-md' 
                    : 'border-transparent hover:border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/50 p-2 md:p-0"
            >
              {/* Product Category/Badge */}
              <div className="mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2E073F]/70">
                  DE DOX CERTIFIED PRODUCT
                </span>
              </div>

              {/* Title & Brand */}
              <div className="mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-serif-luxury tracking-tight">
                  {product.name}
                </h1>
                <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                  By {product.brand} • {product.category}
                </p>
              </div>

              {/* Ratings */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-[#2E073F] text-white px-2.5 py-1 rounded flex items-center space-x-1.5 shadow-sm">
                  <span className="text-sm font-black">{product.rating || 4.8}</span>
                  <Star className="h-3.5 w-3.5 fill-white" />
                </div>
                <button className="text-[12px] font-bold text-[#2E073F] hover:underline decoration-2 underline-offset-4">
                  {product.reviewCount || 24} Verified Reviews
                </button>
              </div>

              {/* Subtitle */}
              <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed italic">
                {product.subtitle || "Authentically sourced, premium luxury fragrance."}
              </p>

              {/* Pricing */}
              <div className="mb-10">
                <div className="flex items-baseline space-x-4">
                  <span className="text-5xl font-bold text-[#2E073F]">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-xl text-gray-300 line-through font-medium leading-none">{formatPrice(product.oldPrice)}</span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Inclusive of all taxes</p>
              </div>

              {/* Info Boxes */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                  <Truck className="h-6 w-6 text-[#2E073F] mb-2 opacity-80" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">Delivery</span>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">{product.deliveryInfo || "Free to UAE"}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-[#2E073F] mb-2 opacity-80" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">Warranty</span>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">{product.warrantyInfo || "Original Batch"}</p>
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
                  className={`w-full bg-[#2E073F] text-white h-16 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 shadow-[0_20px_40px_rgba(46,7,63,0.15)] ${
                    !product.inStock 
                    ? 'opacity-50 cursor-not-allowed grayscale' 
                    : 'hover:scale-[1.02] hover:bg-black active:scale-[0.98]'
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
                  <div className="w-1.5 h-6 bg-[#2E073F] rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Dedox Assurance</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 group">
                    <CheckCircle2 className="h-5 w-5 text-[#2E073F] mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] font-medium text-gray-600 leading-tight">
                      Secure Checkout with Encrypted Payment Processing
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <CheckCircle2 className="h-5 w-5 text-[#2E073F] mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] font-medium text-gray-600 leading-tight">
                      100% Original Batch Sourced Directly from Distributors
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <CheckCircle2 className="h-5 w-5 text-[#2E073F] mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] font-medium text-gray-600 leading-tight">
                      Verified Authenticity Seal & Quality Checked Packaging
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <CheckCircle2 className="h-5 w-5 text-[#2E073F] mt-0.5 flex-shrink-0" />
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
