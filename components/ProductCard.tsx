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
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-[#7a0c0c]/20 hover:shadow-[0_20px_50px_rgba(122,12,12,0.12)] sm:rounded-2xl"
      onMouseEnter={() => setShowCart(true)}
      onMouseLeave={() => setShowCart(false)}
      onTouchStart={() => setShowCart(true)}
    >
      <Link href={`/product/${product.id}`} className="flex min-w-0 flex-grow flex-col">
        <div
          className="relative m-2 mb-0 aspect-[3/4] overflow-hidden rounded-lg bg-white sm:m-2.5 sm:mb-0 sm:aspect-[4/5] sm:rounded-xl"
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
            className="origin-bottom scale-[1.22] object-contain object-bottom transition-transform duration-1000 group-hover:scale-[1.28] sm:scale-[1.18] sm:group-hover:scale-[1.24]"
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

        <div className="mt-auto flex min-w-0 flex-grow flex-col bg-[#7a0c0c] px-3 py-3 sm:px-3.5 sm:py-3.5">
          <div className="mb-0.5 flex items-start justify-between gap-1 sm:mb-1 sm:gap-2">
            <p className="truncate text-[8px] font-bold uppercase tracking-[0.14em] text-white/75 sm:text-[10px] sm:tracking-[0.2em]">
              {product.brand}
            </p>
            {!product.inStock && (
              <span className="shrink-0 text-[7px] font-black uppercase tracking-widest text-white/90 sm:text-[9px]">
                Out of Stock
              </span>
            )}
          </div>
          <h3 className="mb-1.5 line-clamp-2 text-[11px] font-bold leading-snug text-white sm:mb-2 sm:text-[13px]">
            {product.name}
          </h3>

          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:gap-x-2">
            <span className="text-[13px] font-bold text-white sm:text-sm">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-[10px] font-medium text-white/60 line-through sm:text-[11px]">
                  {formatPrice(product.oldPrice)}
                </span>
                {off !== null && (
                  <span className="text-[10px] font-semibold text-amber-200 sm:text-[11px]">
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
