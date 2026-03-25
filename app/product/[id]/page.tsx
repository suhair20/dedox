"use client";

import { products } from "@/lib/data";
import Image from "next/image";
import { Plus, Minus, ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/" className="text-[#0f3d3e] hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#0f3d3e] mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square md:aspect-[4/5] bg-gray-50 overflow-hidden shadow-sm"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center"
              priority
            />
            {product.oldPrice && (
              <div className="absolute top-4 left-4 bg-[#0f3d3e] text-white text-sm font-bold px-3 py-1.5 shadow-md">
                SALE
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                  {product.brand}
                </span>
                <span className="text-xs font-bold tracking-[0.2em] text-[#0f3d3e] uppercase">
                  {product.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-3xl font-bold text-[#0f3d3e]">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">${product.oldPrice}</span>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed text-lg mb-8 border-t border-gray-100 pt-8">
                {product.description}
              </p>
            </div>

            <div className="space-y-8 mt-auto">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-6">
                <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Quantity</span>
                <div className="flex items-center border border-gray-200 bg-gray-50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-600 hover:text-black hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-600 hover:text-black hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => addToCart(product, quantity)}
                  disabled={!product.inStock}
                  className={`flex-1 bg-[#0f3d3e] text-white py-5 px-8 flex items-center justify-center space-x-3 hover:bg-black transition-all duration-300 shadow-xl ${!product.inStock ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-bold uppercase tracking-widest text-sm">
                    {product.inStock ? 'Add to Cart' : 'Sold Out'}
                  </span>
                </button>
                <button className="p-5 border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-gray-100 pt-12 text-sm">
              <div>
                <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-tight">Shipping</h4>
                <p className="text-gray-500">Free delivery on all orders in UAE. Worldwide shipping available.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-tight">Returns</h4>
                <p className="text-gray-500">30-day easy return policy for unworn fragrances.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
