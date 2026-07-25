"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
import StripePaymentSection from '@/components/checkout/StripePaymentSection';
import CheckoutRewardsSection from '@/components/checkout/CheckoutRewardsSection';
import CheckoutPointsTeaser from '@/components/checkout/CheckoutPointsTeaser';
import { isStripePaymentMethod } from '@/lib/checkout/paymentMethods';
import { useAuth } from '@/context/AuthContext';
import ShippingAddressSection from '@/components/checkout/ShippingAddressSection';
import type { ShippingAddressInput } from '@/lib/checkout/types';
import type { RewardProduct } from '@/lib/loyalty/types';
import { pointsFor } from '@/lib/loyalty/points';
import {
  clearPendingReward,
  readPendingReward,
} from '@/lib/loyalty/pendingReward';
import GiftCelebration from '@/components/rewards/GiftCelebration';
import { useRouter } from 'next/navigation';

// Step definitions
const STEPS = [
  { id: 'info', label: 'Information' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' }
];

const emptyAddress: ShippingAddressInput = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  country: 'United Arab Emirates',
  city: '',
  postalCode: '',
  streetAddress: '',
};

export default function CheckoutClient() {
  const { cart, cartReady, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useLocation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'paypal' | 'cod'>('card');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressInput>(emptyAddress);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [stripeClientSecret, setStripeClientSecret] = useState('');
  const [stripeOrderNumber, setStripeOrderNumber] = useState('');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeInitError, setStripeInitError] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState('Home');
  const [pointsBalance, setPointsBalance] = useState(0);
  const [isNewMember, setIsNewMember] = useState(true);
  const [rewardProducts, setRewardProducts] = useState<RewardProduct[]>([]);
  const [redeemRewardProductId, setRedeemRewardProductId] = useState<string | null>(null);
  const [rewardsLoaded, setRewardsLoaded] = useState(false);
  const [claimedGiftName, setClaimedGiftName] = useState<string | null>(null);
  const [showGiftCelebration, setShowGiftCelebration] = useState(false);
  const [earnedPointsPreview, setEarnedPointsPreview] = useState(0);

  useEffect(() => {
    if (!cartReady || isSuccess) return;
    if (cart.length === 0) {
      const pending = readPendingReward();
      router.replace(pending ? '/shop?claim=1' : '/shop');
    }
  }, [cart.length, cartReady, isSuccess, router]);

  useEffect(() => {
    const pending = readPendingReward();
    if (pending?.productId) {
      setRedeemRewardProductId(pending.productId);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setShippingAddress((prev) => ({
      ...prev,
      email: user.email || prev.email,
      phone: user.phone || prev.phone,
    }));
  }, [user]);

  useEffect(() => {
    if (!user) {
      setPointsBalance(0);
      setRewardProducts([]);
      setRewardsLoaded(true);
      return;
    }

    let cancelled = false;

    async function loadRewards() {
      try {
        const response = await fetch('/api/account/points');
        if (!response.ok) {
          if (!cancelled) setRewardsLoaded(true);
          return;
        }
        const data = await response.json();
        if (cancelled) return;
        setPointsBalance(data.summary?.balance ?? 0);
        setIsNewMember(
          (data.summary?.earnedActive ?? 0) === 0 &&
            (data.summary?.redeemedActive ?? 0) === 0
        );
        setRewardProducts(Array.isArray(data.rewards) ? data.rewards : []);
      } catch {
        if (!cancelled) {
          setPointsBalance(0);
          setIsNewMember(true);
          setRewardProducts([]);
        }
      } finally {
        if (!cancelled) setRewardsLoaded(true);
      }
    }

    loadRewards();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!rewardsLoaded || !redeemRewardProductId) return;
    const stillValid = rewardProducts.some(
      (r) => r._id === redeemRewardProductId && r.pointsCost <= pointsBalance
    );
    if (!stillValid) {
      setRedeemRewardProductId(null);
      clearPendingReward();
    }
  }, [redeemRewardProductId, rewardProducts, pointsBalance, rewardsLoaded]);

  const selectedReward = rewardProducts.find(
    (r) => r._id === redeemRewardProductId
  ) ?? null;

  // Derived calculations
  const subtotal = getCartTotal();
  const shippingCost = shippingMethod === 'express' ? 50 : 0; // AED 50 for express
  const tax = subtotal * 0.05; // 5% VAT
  const grandTotal = subtotal + shippingCost + tax;
  const pointsEarnedThisOrder = pointsFor(grandTotal);
  const cheapestRewardCost =
    rewardProducts.length > 0
      ? Math.min(...rewardProducts.map((r) => r.pointsCost))
      : null;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const buildOrderPayload = useCallback(
    (stripePaymentIntentId?: string) => ({
      items: cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      shippingMethod,
      paymentMethod,
      shippingAddress,
      currency: 'AED',
      saveAddress,
      addressLabel,
      ...(redeemRewardProductId ? { redeemRewardProductId } : {}),
      ...(stripePaymentIntentId ? { stripePaymentIntentId } : {}),
    }),
    [
      cart,
      shippingMethod,
      paymentMethod,
      shippingAddress,
      saveAddress,
      addressLabel,
      redeemRewardProductId,
    ]
  );

  const finalizeOrder = useCallback(
    async (stripePaymentIntentId?: string) => {
      const giftName =
        rewardProducts.find((r) => r._id === redeemRewardProductId)?.name ||
        null;
      const pointsPreview = pointsEarnedThisOrder;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildOrderPayload(stripePaymentIntentId)),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      setOrderNumber(data.orderNumber || stripeOrderNumber || '');
      setOrderId(data.orderId || '');
      setEarnedPointsPreview(pointsPreview);
      clearPendingReward();
      clearCart();
      if (redeemRewardProductId && giftName) {
        setClaimedGiftName(giftName);
        setShowGiftCelebration(true);
      }
      setIsSuccess(true);
    },
    [
      buildOrderPayload,
      clearCart,
      stripeOrderNumber,
      redeemRewardProductId,
      rewardProducts,
      pointsEarnedThisOrder,
    ]
  );

  useEffect(() => {
    if (currentStep !== 2 || !isStripePaymentMethod(paymentMethod) || cart.length === 0) {
      setStripeClientSecret('');
      setStripeInitError('');
      return;
    }

    let cancelled = false;

    async function initStripePayment() {
      setStripeLoading(true);
      setStripeInitError('');
      setCheckoutError('');

      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
            shippingMethod,
            paymentMethod,
            shippingAddress,
            currency: 'AED',
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to initialize payment.');
        }

        if (!cancelled) {
          setStripeClientSecret(data.clientSecret);
          setStripeOrderNumber(data.orderNumber || '');
        }
      } catch (error) {
        if (!cancelled) {
          setStripeInitError(
            error instanceof Error ? error.message : 'Failed to initialize payment.'
          );
        }
      } finally {
        if (!cancelled) {
          setStripeLoading(false);
        }
      }
    }

    initStripePayment();

    return () => {
      cancelled = true;
    };
  }, [currentStep, paymentMethod, cart, shippingMethod, shippingAddress]);

  const handleCompleteOrder = async () => {
    if (cart.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    if (isStripePaymentMethod(paymentMethod)) {
      setCheckoutError('Please complete payment using the secure form below.');
      return;
    }

    setIsLoading(true);
    setCheckoutError('');

    try {
      await finalizeOrder();
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : 'Failed to place order.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripePaymentSuccess = async (paymentIntentId: string) => {
    try {
      await finalizeOrder(paymentIntentId);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="relative min-h-screen bg-white flex items-center justify-center p-4">
        <GiftCelebration
          active={showGiftCelebration}
          intensity="full"
          title="Reward claimed!"
          subtitle={
            claimedGiftName
              ? `${claimedGiftName} ships free with this order.`
              : "Your free gift ships with this order."
          }
          onComplete={() => setShowGiftCelebration(false)}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-[#7a0c0c] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Check className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 font-serif-luxury uppercase tracking-tight">Order Confirmed</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {claimedGiftName
              ? `Thank you for choosing Dedox. Your order — plus free gift “${claimedGiftName}” — is being prepared for delivery.`
              : "Thank you for choosing Dedox. Your exquisite collection is being prepared for delivery. Expect its arrival shortly."}
          </p>
          <div className="bg-gray-50 p-6 rounded-3xl mb-10 text-left border border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Number</span>
              <span className="text-xs font-black text-[#7a0c0c]">#{orderNumber || 'DX-PENDING'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Arrival</span>
              <span className="text-xs font-black text-[#7a0c0c]">
                {shippingMethod === 'express' ? '1-2 Days' : '3-5 Days'}
              </span>
            </div>
            {earnedPointsPreview > 0 ? (
              <div className="mt-4 rounded-2xl border border-[#7a0c0c]/10 bg-white px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a0c0c]">
                  Rewards
                </p>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  +{earnedPointsPreview} points after delivery
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Keep shopping — collect enough points and unlock a free bottle on a later order.
                </p>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {orderId ? (
              <Link
                href={`/account/orders/${orderId}`}
                className="inline-block btn-primary px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_40px_rgba(122,12,12,0.15)] hover:scale-[1.05] transition-transform"
              >
                Track Order
              </Link>
            ) : null}
            <Link 
              href="/"
              className="inline-block rounded-2xl border border-gray-200 px-12 py-5 font-black uppercase tracking-[0.2em] text-[11px] text-gray-700 transition hover:border-[#7a0c0c] hover:text-[#7a0c0c]"
            >
              Explore More
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Checkout Navbar */}
      <header className="bg-white border-b border-gray-100 py-4 sm:py-6 sticky top-0 z-[100]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20 max-w-7xl">
            <div className="mb-4 flex items-center justify-center gap-2 md:hidden">
              {STEPS.map((step, idx) => (
                <span
                  key={step.id}
                  className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${
                    idx === currentStep
                      ? "bg-[#7a0c0c] text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
            <Logo className="scale-75 sm:scale-90" />
            <div className="hidden md:flex items-center space-x-12">
              {STEPS.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${
                    idx === currentStep ? 'text-[#7a0c0c]' : 'text-gray-300'
                  }`}>
                    {idx + 1}. {step.label}
                  </span>
                  {idx < STEPS.length - 1 && (
                    <div className="h-[1px] w-6 bg-gray-100 mx-4" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 text-[#7a0c0c]">
              <Lock className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12 lg:px-20">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 sm:gap-16">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-8 sm:space-y-12">
            
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 sm:space-y-10"
                >
                  <section>
                    <div className="mb-5 flex items-center space-x-3 sm:mb-8 sm:space-x-4">
                      <div className="h-5 w-1 rounded-full bg-[#7a0c0c] sm:h-6 sm:w-1.5" />
                      <h2 className="font-serif-luxury text-lg font-bold tracking-tight text-gray-900 sm:text-2xl">
                        Delivery details
                      </h2>
                    </div>
                    <ShippingAddressSection
                      shippingAddress={shippingAddress}
                      setShippingAddress={setShippingAddress}
                      saveAddress={saveAddress}
                      setSaveAddress={setSaveAddress}
                      addressLabel={addressLabel}
                      setAddressLabel={setAddressLabel}
                      isAuthenticated={Boolean(user)}
                    />
                  </section>
                  
                  <button 
                    onClick={nextStep}
                    className="form-btn w-full gap-3 btn-primary shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] md:w-auto"
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
                  className="space-y-6 sm:space-y-10"
                >
                  <button onClick={prevStep} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7a0c0c] mb-4">
                    <ArrowLeft className="h-3 w-3 mr-2" />
                    Back to Info
                  </button>

                  <section>
                    <div className="mb-5 flex items-center space-x-3 sm:mb-8 sm:space-x-4">
                      <div className="h-5 w-1 rounded-full bg-[#7a0c0c] sm:h-6 sm:w-1.5" />
                      <h2 className="font-serif-luxury text-lg font-bold tracking-tight text-gray-900 sm:text-2xl">Delivery Method</h2>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Standard */}
                      <button 
                        onClick={() => setShippingMethod('standard')}
                        className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 transition-all sm:rounded-3xl sm:p-8 ${
                          shippingMethod === 'standard' 
                          ? 'border-[#7a0c0c] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-6 text-left">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            shippingMethod === 'standard' ? 'border-[#7a0c0c]' : 'border-gray-300'
                          }`}>
                            {shippingMethod === 'standard' && <div className="w-3 h-3 bg-[#7a0c0c] rounded-full" />}
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
                        className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 transition-all sm:rounded-3xl sm:p-8 ${
                          shippingMethod === 'express' 
                          ? 'border-[#7a0c0c] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-6 text-left">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            shippingMethod === 'express' ? 'border-[#7a0c0c]' : 'border-gray-300'
                          }`}>
                            {shippingMethod === 'express' && <div className="w-3 h-3 bg-[#7a0c0c] rounded-full" />}
                          </div>
                          <div>
                            <p className="font-black uppercase tracking-widest text-[11px] text-gray-900 mb-1">Express Courier</p>
                            <p className="text-[12px] text-gray-500 font-medium italic underline decoration-gray-200 underline-offset-4 decoration-2">Priority Arrival in 1 - 2 Days</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-[#7a0c0c]">{formatPrice(50)}</span>
                      </button>
                    </div>
                  </section>

                  {user ? (
                    <CheckoutRewardsSection
                      balance={pointsBalance}
                      rewards={rewardProducts}
                      selectedRewardId={redeemRewardProductId}
                      onSelect={(id) => {
                        setRedeemRewardProductId(id);
                        if (!id) {
                          clearPendingReward();
                        }
                      }}
                    />
                  ) : null}

                  <button 
                    onClick={nextStep}
                    className="form-btn w-full gap-3 btn-primary shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] md:w-auto"
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
                  className="space-y-6 sm:space-y-10"
                >
                  <button onClick={prevStep} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7a0c0c] mb-4">
                    <ArrowLeft className="h-3 w-3 mr-2" />
                    Back to Shipping
                  </button>

                  <section>
                    <div className="mb-5 flex items-center space-x-3 sm:mb-8 sm:space-x-4">
                      <div className="h-5 w-1 rounded-full bg-[#7a0c0c] sm:h-6 sm:w-1.5" />
                      <h2 className="font-serif-luxury text-lg font-bold tracking-tight text-gray-900 sm:text-2xl">Payment Method</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {/* Credit Card */}
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 transition-all sm:gap-4 sm:rounded-3xl sm:p-8 ${
                          paymentMethod === 'card' 
                          ? 'border-[#7a0c0c] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <CreditCard className={`h-8 w-8 ${paymentMethod === 'card' ? 'text-[#7a0c0c]' : 'text-gray-400'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Credit / Debit Card</span>
                      </button>

                      {/* UPI */}
                      <button 
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 transition-all sm:gap-4 sm:rounded-3xl sm:p-8 ${
                          paymentMethod === 'upi' 
                          ? 'border-[#7a0c0c] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <Smartphone className={`h-8 w-8 ${paymentMethod === 'upi' ? 'text-[#7a0c0c]' : 'text-gray-400'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">UPI / Digital Wallet</span>
                      </button>

                      {/* PayPal */}
                      <button 
                        onClick={() => setPaymentMethod('paypal')}
                        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 transition-all sm:gap-4 sm:rounded-3xl sm:p-8 ${
                          paymentMethod === 'paypal' 
                          ? 'border-[#7a0c0c] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="text-xl font-black italic tracking-tighter text-[#003087]">Pay<span className="text-[#009cde]">Pal</span></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">PayPal Express Checkout</span>
                      </button>

                      {/* COD */}
                      <button 
                        onClick={() => setPaymentMethod('cod')}
                        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 transition-all sm:gap-4 sm:rounded-3xl sm:p-8 ${
                          paymentMethod === 'cod' 
                          ? 'border-[#7a0c0c] bg-white shadow-xl' 
                          : 'border-gray-50 bg-white/50 hover:border-gray-200 opacity-60'
                        }`}
                      >
                        <Banknote className={`h-8 w-8 ${paymentMethod === 'cod' ? 'text-[#7a0c0c]' : 'text-gray-400'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Cash on Delivery</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {isStripePaymentMethod(paymentMethod) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-8"
                        >
                          {stripeLoading && (
                            <div className="flex items-center justify-center rounded-3xl border border-gray-100 bg-gray-50/50 p-10">
                              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7a0c0c]/20 border-t-[#7a0c0c]" />
                            </div>
                          )}

                          {!stripeLoading && stripeInitError && (
                            <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                              {stripeInitError}
                            </p>
                          )}

                          {!stripeLoading && stripeClientSecret && (
                            <StripePaymentSection
                              clientSecret={stripeClientSecret}
                              amountLabel={formatPrice(grandTotal)}
                              isSubmitting={isLoading}
                              onSubmittingChange={setIsLoading}
                              onSuccess={handleStripePaymentSuccess}
                              onError={setCheckoutError}
                            />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>

                  {checkoutError && (
                    <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {checkoutError}
                    </p>
                  )}

                  {paymentMethod === 'cod' && (
                  <button 
                    onClick={handleCompleteOrder}
                    disabled={isLoading}
                  className="form-btn w-full btn-primary shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] md:w-auto"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Place Order (COD)</span>
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  )}
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
                        <p className="text-xs font-black text-[#7a0c0c] mt-2">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                  {selectedReward ? (
                    <div className="flex space-x-6 items-center">
                      <div className="relative w-20 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-[#7a0c0c]/20">
                        <Image
                          src={
                            selectedReward.imageUrl ||
                            "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=200"
                          }
                          alt={selectedReward.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-[13px] font-black text-gray-900 uppercase tracking-wide leading-tight mb-1">
                          {selectedReward.name}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-medium">
                          Loyalty gift · {selectedReward.pointsCost} pts
                        </p>
                        <p className="text-xs font-black text-green-600 mt-2 uppercase tracking-widest">
                          Free
                        </p>
                      </div>
                    </div>
                  ) : null}
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
                  <div className="flex justify-between items-center py-6 border-t-[3px] border-[#7a0c0c]/5">
                    <span className="text-base font-black text-gray-900 uppercase tracking-[0.2em] font-serif-luxury">Order Total</span>
                    <span className="text-2xl font-black text-[#7a0c0c] tracking-tight">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <CheckoutPointsTeaser
                  orderTotal={grandTotal}
                  pointsEarned={pointsEarnedThisOrder}
                  currentBalance={user ? pointsBalance : 0}
                  cheapestRewardCost={cheapestRewardCost}
                  isNewMember={Boolean(user) && isNewMember}
                  isGuest={!user}
                />

                {/* Promo Code */}
                <div className="mt-8 flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon / Promo Code"
                    className="form-input flex-grow"
                  />
                  <button className="btn-primary h-11 shrink-0 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm sm:h-12 sm:px-6">Apply</button>
                </div>
              </div>

              {/* Dedox Trust Card */}
              <div className="bg-white rounded-[32px] p-8 border border-gray-50 shadow-sm flex items-center space-x-6">
                <div className="w-14 h-14 bg-[#7a0c0c]/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-7 w-7 text-[#7a0c0c]" />
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
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7a0c0c] transition-colors">Privacy</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7a0c0c] transition-colors">Terms</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7a0c0c] transition-colors">Support</Link>
        </div>
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">&copy; 2026 Dedox Fragrance House • UAE</p>
      </footer>
    </div>
  );
}
