"use client";

import React, { useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ShieldCheck,  
  CreditCard,  
  Smartphone, 
  Banknote, 
  Check, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';

// Step definitions
const STEPS = [
  { id: 'info', label: 'Information' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' }
];

export default function CheckoutPage() {
  const { cart, getCartTotal } = useCart();
  const { formatPrice, currency } = useLocation();
  const [currentStep, setCurrentStep] = useState(0); // 0: Info, 1: Shipping, 2: Payment
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  // Derived calculations
  const subtotal = getCartTotal();
  const shippingCost = shippingMethod === 'express' ? 50 : 0; // AED 50 for express
  const tax = subtotal * 0.05; // 5% VAT
  const grandTotal = subtotal + shippingCost + tax;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleCompleteOrder = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-[#2E073F] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Check className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 font-serif-luxury uppercase tracking-tight">Order Confirmed</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for choosing Dedox. Your exquisite collection is being prepared for delivery. Expect its arrival shortly.
          </p>
          <div className="bg-gray-50 p-6 rounded-3xl mb-10 text-left border border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Number</span>
              <span className="text-xs font-black text-[#2E073F]">#DX-990812</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Arrival</span>
              <span className="text-xs font-black text-[#2E073F]">
                {shippingMethod === 'express' ? '1-2 Days' : '3-5 Days'}
              </span>
            </div>
          </div>
          <Link 
            href="/"
            className="inline-block bg-[#2E073F] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_40px_rgba(46,7,63,0.15)] hover:scale-[1.05] transition-transform"
          >
            Explore More
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Checkout Navbar */}
      <header className="bg-white border-b border-gray-100 py-4 sm:py-6 sticky top-0 z-[100]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20 max-w-7xl">
          <div className="flex items-center justify-between">
            <Logo className="scale-75 sm:scale-90" />
            <div className="hidden md:flex items-center space-x-12">
              {STEPS.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${
                    idx === currentStep ? 'text-[#2E073F]' : 'text-gray-300'
                  }`}>
                    {idx + 1}. {step.label}
                  </span>
                  {idx < STEPS.length - 1 && (
                    <div className="h-[1px] w-6 bg-gray-100 mx-4" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 text-[#2E073F]">
              <Lock className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 max-w-7xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-12">
            
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >
                  <section>
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-1.5 h-6 bg-[#2E073F] rounded-full" />
                      <h2 className="text-2xl font-bold text-gray-900 font-serif-luxury tracking-tight">Contact Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        type="email" 
                        placeholder="Email Address"
                        className="w-full h-16 px-6 bg-white border border-gray-100 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm"
                      />
                      <input 
                        type="tel" 
                        placeholder="Phone Number"
                        className="w-full h-16 px-6 bg-white border border-gray-100 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm"
                      />
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-1.5 h-6 bg-[#2E073F] rounded-full" />
                      <h2 className="text-2xl font-bold text-gray-900 font-serif-luxury tracking-tight">Shipping Address</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        type="text" 
                        placeholder="First Name"
                        className="w-full h-16 px-6 bg-white border border-gray-100 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm"
                      />
                      <input 
                        type="text" 
                        placeholder="Last Name"
                        className="w-full h-16 px-6 bg-white border border-gray-100 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm"
                      />
                      <div className="md:col-span-2">
                        <select className="w-full h-16 px-6 bg-white border border-gray-100 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm text-gray-500 appearance-none">
                          <option>Select Country</option>
                          <option>United Arab Emirates</option>
                          <option>India</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                        </select>
                      </div>
                      <input 
                        type="text" 
                        placeholder="City"
                        className="w-full h-16 px-6 bg-white border border-gray-100 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm"
                      />
                      <input 
                        type="text" 
                        placeholder="ZIP / Post Code"
                        className="w-full h-16 px-6 bg-white border border-gray-100 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm"
                      />
                      <div className="md:col-span-2">
                        <textarea 
                          placeholder="Full Street Address"
                          rows={3}
                          className="w-full px-6 py-5 bg-white border border-gray-100 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm resize-none"
                        />
                      </div>
                    </div>
                  </section>
                  
                  <button 
                    onClick={nextStep}
                    className="w-full md:w-auto px-16 h-16 bg-[#2E073F] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                  >
                    <span>Continue to Shipping</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >
                  <button onClick={prevStep} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2E073F] mb-4">
                    <ArrowLeft className="h-3 w-3 mr-2" />
                    Back to Info
                  </button>

                  <section>
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-1.5 h-6 bg-[#2E073F] rounded-full" />
                      <h2 className="text-2xl font-bold text-gray-900 font-serif-luxury tracking-tight">Delivery Method</h2>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Standard */}
                      <button 
                        onClick={() => setShippingMethod('standard')}
                        className={`w-full flex items-center justify-between p-8 rounded-3xl border-2 transition-all ${
                          shippingMethod === 'standard' 
                          ? 'border-[#2E073F] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-6 text-left">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            shippingMethod === 'standard' ? 'border-[#2E073F]' : 'border-gray-300'
                          }`}>
                            {shippingMethod === 'standard' && <div className="w-3 h-3 bg-[#2E073F] rounded-full" />}
                          </div>
                          <div>
                            <p className="font-black uppercase tracking-widest text-[11px] text-gray-900 mb-1">Standard Delivery</p>
                            <p className="text-[12px] text-gray-500 font-medium italic underline decoration-gray-200 underline-offset-4 decoration-2">Arrival in 3 - 5 Business Days</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-green-600 uppercase tracking-widest">Free</span>
                      </button>

                      {/* Express */}
                      <button 
                        onClick={() => setShippingMethod('express')}
                        className={`w-full flex items-center justify-between p-8 rounded-3xl border-2 transition-all ${
                          shippingMethod === 'express' 
                          ? 'border-[#2E073F] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-6 text-left">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            shippingMethod === 'express' ? 'border-[#2E073F]' : 'border-gray-300'
                          }`}>
                            {shippingMethod === 'express' && <div className="w-3 h-3 bg-[#2E073F] rounded-full" />}
                          </div>
                          <div>
                            <p className="font-black uppercase tracking-widest text-[11px] text-gray-900 mb-1">Express Courier</p>
                            <p className="text-[12px] text-gray-500 font-medium italic underline decoration-gray-200 underline-offset-4 decoration-2">Priority Arrival in 1 - 2 Days</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-[#2E073F]">{formatPrice(50)}</span>
                      </button>
                    </div>
                  </section>

                  <button 
                    onClick={nextStep}
                    className="w-full md:w-auto px-16 h-16 bg-[#2E073F] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >
                  <button onClick={prevStep} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2E073F] mb-4">
                    <ArrowLeft className="h-3 w-3 mr-2" />
                    Back to Shipping
                  </button>

                  <section>
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-1.5 h-6 bg-[#2E073F] rounded-full" />
                      <h2 className="text-2xl font-bold text-gray-900 font-serif-luxury tracking-tight">Payment Method</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {/* Credit Card */}
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all gap-4 ${
                          paymentMethod === 'card' 
                          ? 'border-[#2E073F] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <CreditCard className={`h-8 w-8 ${paymentMethod === 'card' ? 'text-[#2E073F]' : 'text-gray-400'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Credit / Debit Card</span>
                      </button>

                      {/* UPI */}
                      <button 
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all gap-4 ${
                          paymentMethod === 'upi' 
                          ? 'border-[#2E073F] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <Smartphone className={`h-8 w-8 ${paymentMethod === 'upi' ? 'text-[#2E073F]' : 'text-gray-400'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">UPI / Digital Wallet</span>
                      </button>

                      {/* PayPal */}
                      <button 
                        onClick={() => setPaymentMethod('paypal')}
                        className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all gap-4 ${
                          paymentMethod === 'paypal' 
                          ? 'border-[#2E073F] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="text-xl font-black italic tracking-tighter text-[#003087]">Pay<span className="text-[#009cde]">Pal</span></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">PayPal Express Checkout</span>
                      </button>

                      {/* COD */}
                      <button 
                        onClick={() => setPaymentMethod('cod')}
                        className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all gap-4 ${
                          paymentMethod === 'cod' 
                          ? 'border-[#2E073F] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <Banknote className={`h-8 w-8 ${paymentMethod === 'cod' ? 'text-[#2E073F]' : 'text-gray-400'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Cash on Delivery</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {paymentMethod === 'card' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 mb-8"
                        >
                          <div className="space-y-6">
                            <input 
                              type="text" 
                              placeholder="Cardholder Name"
                              className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm"
                            />
                            <div className="relative">
                              <input 
                                type="text" 
                                placeholder="Card Number"
                                className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm pr-12"
                              />
                              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 pointer-events-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <input 
                                type="text" 
                                placeholder="Expiry (MM/YY)"
                                className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm"
                              />
                              <input 
                                type="text" 
                                placeholder="CVV"
                                className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:border-[#2E073F] outline-none transition-all shadow-sm font-medium text-sm"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>

                  <button 
                    onClick={handleCompleteOrder}
                    disabled={isLoading}
                    className="w-full md:w-auto px-16 h-16 bg-[#2E073F] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Complete Purchase</span>
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-12 xl:col-span-5 relative">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 sm:p-10">
                <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-6">
                  <h3 className="text-xl font-bold text-gray-900 font-serif-luxury uppercase tracking-tight">Order Summary</h3>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cart.length} Fragrances</span>
                </div>

                {/* Item List (Scrollable) */}
                <div className="max-h-[350px] overflow-y-auto pr-4 space-y-8 mb-10 scrollbar-thin scrollbar-thumb-gray-100">
                  {cart.map((item) => (
                    <div key={item.id} className="flex space-x-6 items-center">
                      <div className="relative w-20 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-50">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-[13px] font-black text-gray-900 uppercase tracking-wide leading-tight mb-1">{item.name}</h4>
                        <p className="text-[11px] text-gray-400 font-medium">Quantity: {item.quantity}</p>
                        <p className="text-xs font-black text-[#2E073F] mt-2">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Table */}
                <div className="space-y-4 pt-10 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                    <span className="text-sm font-bold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Est. Shipping</span>
                    <span className={`text-sm font-black uppercase tracking-widest ${shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>{shippingCost === 0 ? 'Complementary' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">VAT / Taxes</span>
                    <span className="text-sm font-bold text-gray-900">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between items-center py-6 border-t-[3px] border-[#2E073F]/5">
                    <span className="text-base font-black text-gray-900 uppercase tracking-[0.2em] font-serif-luxury">Order Total</span>
                    <span className="text-2xl font-black text-[#2E073F] tracking-tight">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-8 flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon / Promo Code"
                    className="flex-grow h-12 px-4 bg-gray-50 border border-transparent rounded-xl focus:border-gray-200 outline-none transition-all text-xs font-medium"
                  />
                  <button className="px-6 h-12 bg-white border border-gray-200 text-gray-900 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all shadow-sm">Apply</button>
                </div>
              </div>

              {/* Dedox Trust Card */}
              <div className="bg-white rounded-[32px] p-8 border border-gray-50 shadow-sm flex items-center space-x-6">
                <div className="w-14 h-14 bg-[#2E073F]/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-7 w-7 text-[#2E073F]" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 mb-1">Authenticated Luxury</h4>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Each fragrance is verified for authenticity and batch quality by our specialists.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Minimal */}
      <footer className="py-20 text-center border-t border-gray-100">
        <Logo className="scale-75 opacity-20 filter grayscale mx-auto mb-8" />
        <div className="flex justify-center space-x-12 mb-8">
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2E073F] transition-colors">Privacy</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2E073F] transition-colors">Terms</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2E073F] transition-colors">Support</Link>
        </div>
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">&copy; 2026 Dedox Fragrance House • UAE</p>
      </footer>
    </div>
  );
}
