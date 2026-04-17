"use client";

import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { formatPrice } = useLocation();

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-4xl font-bold text-[#2E073F] tracking-tight font-serif-luxury">Your Cart</h1>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{cart.length} Items</span>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <AnimatePresence mode='popLayout'>
                  {cart.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-start sm:items-center space-x-6 pb-8 border-b border-gray-50"
                    >
                      <div className="relative w-24 h-32 sm:w-32 sm:h-40 bg-gray-50 overflow-hidden flex-shrink-0 shadow-sm rounded-xl">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900 hover:text-[#2E073F] transition-colors font-serif-luxury">
                            <Link href={`/product/${item.id}`}>{item.name}</Link>
                          </h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <p className="text-lg font-bold text-[#2E073F] mb-6">{formatPrice(item.price)}</p>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border border-gray-200 bg-gray-50 rounded-full h-10 px-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total: {formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#f8f9fa] p-8 border border-gray-100 shadow-sm sticky top-32 rounded-3xl">
                <h3 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4 tracking-tight">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm font-medium">Subtotal</span>
                    <span className="font-bold">{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm font-medium">Shipping</span>
                    <span className="font-black text-green-600 uppercase text-[10px] tracking-widest pt-1">Free</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-2xl font-bold text-gray-900 border-t border-gray-200 pt-6 mb-10">
                  <span className="font-serif-luxury">Total</span>
                  <span className="text-[#2E073F] tracking-tight">{formatPrice(getCartTotal())}</span>
                </div>
                
                <Link href="/checkout" className="w-full bg-[#2E073F] text-white py-5 px-8 rounded-2xl flex items-center justify-center space-x-3 hover:bg-black transition-all duration-300 shadow-[0_20px_40_rgba(46,7,63,0.15)] group">
                  <span className="font-bold uppercase tracking-widest text-sm">Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <p className="mt-6 text-[10px] text-gray-400 text-center uppercase tracking-[0.2em] font-black">Secure Checkout via Dedox</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 border border-dashed border-gray-200 rounded-[2rem]">
            <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <ShoppingBag className="h-10 w-10 text-gray-200" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight font-serif-luxury">Your cart is empty</h2>
            <p className="text-gray-500 mb-10 max-w-xs mx-auto text-sm">Looks like you haven&apos;t added any premium fragrances to your collection yet.</p>
            <Link href="/" className="bg-[#2E073F] text-white px-12 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg inline-block text-sm">
              Start Discovering
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
