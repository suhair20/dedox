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
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { motion, AnimatePresence } from "framer-motion";
import AttributeChipList from "@/components/catalog/AttributeChipList";
import ProductReviews from "@/components/reviews/ProductReviews";

export default function ProductView({ params }: { params: { id: string } }) {
  const { id } = params;
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [selectedSizeKey, setSelectedSizeKey] = useState<string>("");
  const { addToCart } = useCart();
  const { formatPrice } = useLocation();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  
  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnails = product?.thumbnails?.length
    ? product.thumbnails
    : [product?.image || ""];
  const mainImage = thumbnails[selectedImageIndex] || product?.image || "";

  const sizeOptions = product?.sizes?.length ? product.sizes : [];
  const selectedSize =
    sizeOptions.find((size) => size.key === selectedSizeKey) ||
    sizeOptions.find((size) => size.inStock !== false) ||
    sizeOptions[0];
  const displayPrice = selectedSize?.price ?? product?.price ?? 0;
  const displayOldPrice = selectedSize?.oldPrice ?? product?.oldPrice;
  const sizeInStock = selectedSize ? selectedSize.inStock !== false : product?.inStock;

  useEffect(() => {
    setSelectedImageIndex(0);
    setDescriptionExpanded(false);
    const firstAvailable =
      product?.sizes?.find((size) => size.inStock !== false) || product?.sizes?.[0];
    setSelectedSizeKey(firstAvailable?.key || "");
  }, [product?.id, product?.sizes]);

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

  const cartItem = {
    id: product.id,
    name: product.name,
    price: displayPrice,
    image: product.image,
    sizeKey: selectedSize?.key,
    sizeLabel: selectedSize?.label,
  };

  const handleAddToCart = () => {
    if (!sizeInStock) return;
    addToCart(cartItem, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (!sizeInStock) return;
    addToCart(cartItem, quantity);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#faf6f5] pb-44 pt-8 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#7a0c0c] transition-colors">
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-20">
          
          {/* Left Column: Visuals */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28 lg:self-start">
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
                    className="object-contain object-center p-6 sm:p-10"
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
                      className="object-contain object-center p-2"
                    />
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="relative z-0 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-5 sm:rounded-3xl sm:border sm:border-gray-100 sm:p-8 sm:shadow-sm lg:bg-transparent lg:p-0 lg:shadow-none"
            >
              {/* Title, brand & price */}
              <div className="mb-6 rounded-2xl border border-[#7a0c0c]/25 bg-white p-5 shadow-[0_12px_40px_rgba(122,12,12,0.1)] sm:mb-8 sm:p-6">
                <div className="mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7a0c0c]/80">
                    DEDOX CERTIFIED PRODUCT
                  </span>
                </div>
                <div className="mb-4">
                  <h1 className="mb-2 text-xl font-medium tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
                    {product.name}
                  </h1>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                    By {product.brand} • {product.category}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="text-xl font-semibold text-[#7a0c0c] sm:text-2xl">{formatPrice(displayPrice)}</span>
                    {displayOldPrice && displayOldPrice > displayPrice && (
                      <span className="text-sm font-medium leading-none text-gray-400 line-through sm:text-base">{formatPrice(displayOldPrice)}</span>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Inclusive of all taxes</p>
                </div>
              </div>

              {/* Ratings — only real published reviews */}
              <div className="mb-6 flex items-center space-x-4">
                {product.reviewCount ? (
                  <>
                    <div className="flex items-center gap-2 rounded border border-[#7a0c0c]/20 bg-[#7a0c0c]/[0.06] px-2.5 py-1 shadow-sm">
                      <span className="text-sm font-black text-[#7a0c0c]">{Number(product.rating || 0).toFixed(1)}</span>
                      <Star className="h-3.5 w-3.5 fill-[#7a0c0c] text-[#7a0c0c]" />
                    </div>
                    <a
                      href="#reviews"
                      className="text-[12px] font-bold text-[#7a0c0c] hover:underline decoration-2 underline-offset-4"
                    >
                      {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
                    </a>
                  </>
                ) : (
                  <a
                    href="#reviews"
                    className="text-[12px] font-bold text-[#7a0c0c] hover:underline decoration-2 underline-offset-4"
                  >
                    Be the first to review
                  </a>
                )}
              </div>

              {/* Subtitle & description */}
              <div className="mb-8 space-y-3">
                {product.subtitle ? (
                  <p className="text-sm font-medium leading-relaxed text-gray-600">
                    {product.subtitle}
                  </p>
                ) : null}
                {product.description ? (
                  <div>
                    <p
                      className={`text-sm leading-relaxed text-gray-500 sm:text-[15px] ${
                        descriptionExpanded ? "" : "line-clamp-3"
                      }`}
                    >
                      {product.description}
                    </p>
                    {product.description.length > 120 ? (
                      <button
                        type="button"
                        onClick={() => setDescriptionExpanded((open) => !open)}
                        className="mt-1.5 text-xs font-bold uppercase tracking-widest text-[#7a0c0c] hover:underline"
                      >
                        {descriptionExpanded ? "Show less" : "Read more"}
                      </button>
                    ) : null}
                  </div>
                ) : !product.subtitle ? (
                  <p className="text-sm font-medium leading-relaxed text-gray-500">
                    Authentically sourced, premium luxury fragrance.
                  </p>
                ) : null}
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
              <div className="mb-12 space-y-4 rounded-2xl border border-gray-50 bg-white p-4 shadow-sm sm:space-y-6 sm:rounded-3xl sm:p-8">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-1.5 rounded-full bg-[#7a0c0c]" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">
                    Fragrance Profile
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-6">
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
                {sizeOptions.length > 0 ? (
                  <div className="px-2">
                    <span className="mb-3 block text-[11px] font-black uppercase tracking-widest text-gray-900">
                      Size
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((size) => {
                        const active = selectedSize?.key === size.key;
                        const disabled = size.inStock === false;
                        return (
                          <button
                            key={size.key}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSelectedSizeKey(size.key)}
                            className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
                              active
                                ? "border-[#7a0c0c] bg-[#7a0c0c] text-white"
                                : "border-gray-200 bg-white text-gray-700 hover:border-[#7a0c0c]/40"
                            } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                          >
                            {size.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

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

                <div className="hidden gap-3 md:grid md:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!sizeInStock}
                    className={`flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#7a0c0c] bg-white text-[#7a0c0c] transition ${
                      !sizeInStock ? "cursor-not-allowed opacity-50" : "hover:bg-[#7a0c0c]/5"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      {added ? "Added" : sizeInStock ? "Add to Cart" : "Out of Stock"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!sizeInStock}
                    className={`btn-primary flex h-14 items-center justify-center gap-2 rounded-2xl shadow-[0_16px_32px_rgba(122,12,12,0.18)] ${
                      !sizeInStock ? "cursor-not-allowed opacity-50 grayscale" : "hover:scale-[1.01]"
                    }`}
                  >
                    <Zap className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Buy Now</span>
                  </button>
                </div>
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

        {/* Full-width below gallery + details so sticky image never covers reviews */}
        <div className="relative z-10 mt-10 sm:mt-14">
          <ProductReviews
            productId={product.id}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-white/10 bg-[#1a0505] px-3 py-2.5 pb-[max(0.7rem,env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(0,0,0,0.35)] md:px-6 md:py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200/80">
              {product.name}
            </p>
            <p className="font-serif-luxury text-lg leading-tight text-amber-100 sm:text-xl">
              {formatPrice(displayPrice)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!sizeInStock}
            className={`inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-amber-200/50 bg-transparent px-3.5 text-amber-100 sm:h-12 sm:px-5 ${
              !sizeInStock ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest sm:text-[11px]">
              {added ? "Added" : "Add"}
            </span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!sizeInStock}
            className={`inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-100 via-white to-amber-50 px-4 text-[#7a0c0c] sm:h-12 sm:px-6 ${
              !sizeInStock ? "cursor-not-allowed opacity-50 grayscale" : ""
            }`}
          >
            <Zap className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest sm:text-[11px]">
              Buy Now
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
