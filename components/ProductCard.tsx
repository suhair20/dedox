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
      className="group relative flex h-full flex-col rounded-2xl border border-transparent bg-white p-2 transition-all duration-300 hover:border-white/50 hover:shadow-[0_20px_50px_rgba(122,12,12,0.1)]"
      onMouseEnter={() => setShowCart(true)}
      onMouseLeave={() => setShowCart(false)}
      onTouchStart={() => setShowCart(true)}
    >
      <Link href={`/product/${product.id}`} className="flex flex-grow flex-col">
        <div
          className="relative mb-3 aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#fafafa] sm:mb-4"
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
            className="object-contain object-center transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
            style={{ mixBlendMode: "multiply" }}
          />

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            aria-hidden={!showCart}
            className={`absolute bottom-2 left-2 right-2 z-10 flex h-9 items-center justify-center gap-2 rounded-full transition-all duration-300 sm:h-10 sm:gap-3 ${
              showCart
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-2 opacity-0"
            } ${
              !product.inStock
                ? "cursor-not-allowed grayscale"
                : "btn-primary active:scale-95 shadow-md"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {product.inStock ? "Add to cart" : "Sold Out"}
            </span>
          </button>
        </div>

        <div className="flex flex-grow flex-col px-1 pb-1 sm:px-2 sm:pb-2">
          <div className="mb-1 flex items-start justify-between gap-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7a0c0c] sm:text-[10px] sm:tracking-[0.2em]">
              {product.brand}
            </p>
            {!product.inStock && (
              <span className="text-[8px] font-black uppercase tracking-widest text-red-500 sm:text-[9px]">
                Out of Stock
              </span>
            )}
          </div>
          <h3 className="mb-2 line-clamp-2 text-[12px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#7a0c0c] sm:text-[13px]">
            {product.name}
          </h3>

          <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-[11px] font-medium text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                {off !== null && (
                  <span className="text-[11px] font-semibold text-emerald-600">{off}% off</span>
                )}
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
