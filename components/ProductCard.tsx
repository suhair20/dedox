"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    category: string;
    brand: string;
    inStock: boolean;
  };
}

function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round((1 - price / oldPrice) * 100);
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showCart, setShowCart] = useState(false);
  const { addToCart } = useCart();
  const { formatPrice } = useLocation();
  const off = discountPercent(product.price, product.oldPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-[#ffffff] p-2 shadow-sm transition-all duration-300 hover:border-white/50 hover:shadow-[0_20px_50px_rgba(122,12,12,0.1)] sm:rounded-2xl sm:p-2.5"
      onMouseEnter={() => setShowCart(true)}
      onMouseLeave={() => setShowCart(false)}
      onTouchStart={() => setShowCart(true)}
    >
      <Link href={`/product/${product.id}`} className="flex min-w-0 flex-grow flex-col">
        <div
          className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#ffffff] sm:mb-4 sm:aspect-[4/5] sm:rounded-xl"
          onClick={(e) => {
            if (!showCart) {
              e.preventDefault();
              setShowCart(true);
            }
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            className="object-contain object-center p-1.5 transition-transform duration-1000 group-hover:scale-105 sm:p-2"
            sizes="(max-width: 640px) 10rem, (max-width: 1024px) 25vw, 15vw"
          />

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            aria-hidden={!showCart}
            className={`absolute bottom-2 left-2 right-2 z-10 mx-auto flex h-7 max-w-[calc(100%-0.5rem)] items-center justify-center gap-1 rounded-full px-2 transition-all duration-300 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 sm:h-10 sm:max-w-none sm:gap-2 sm:px-3 ${
              showCart
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-2 opacity-0"
            } ${
              !product.inStock
                ? "cursor-not-allowed grayscale"
                : "btn-primary active:scale-95 shadow-md"
            }`}
          >
            <ShoppingCart className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate text-[8px] font-black uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-[0.2em]">
              <span className="sm:hidden">{product.inStock ? "Add" : "Sold"}</span>
              <span className="hidden sm:inline">
                {product.inStock ? "Add to cart" : "Sold Out"}
              </span>
            </span>
          </button>
        </div>

        <div className="flex min-w-0 flex-grow flex-col px-0.5 pb-0.5 sm:px-1.5 sm:pb-1.5">
          <div className="mb-0.5 flex items-start justify-between gap-1 sm:mb-1 sm:gap-2">
            <p className="truncate text-[8px] font-bold uppercase tracking-[0.14em] text-[#7a0c0c] sm:text-[10px] sm:tracking-[0.2em]">
              {product.brand}
            </p>
            {!product.inStock && (
              <span className="shrink-0 text-[7px] font-black uppercase tracking-widest text-red-500 sm:text-[9px]">
                Out of Stock
              </span>
            )}
          </div>
          <h3 className="mb-1.5 line-clamp-2 text-[11px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#7a0c0c] sm:mb-2 sm:text-[13px]">
            {product.name}
          </h3>

          <div className="mt-auto flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:gap-x-2">
            <span className="text-[13px] font-bold text-gray-900 sm:text-sm">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-[10px] font-medium text-gray-400 line-through sm:text-[11px]">
                  {formatPrice(product.oldPrice)}
                </span>
                {off !== null && (
                  <span className="text-[10px] font-semibold text-emerald-600 sm:text-[11px]">
                    {off}% off
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
