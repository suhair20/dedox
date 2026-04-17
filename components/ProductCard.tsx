"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, ShoppingCart } from "lucide-react";
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

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { formatPrice } = useLocation();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity);
  };

  return (
    <div className="group relative bg-white transition-all duration-500 flex flex-col h-full hover:shadow-[0_20px_50px_rgba(46,7,63,0.1)] rounded-2xl p-2 border border-transparent hover:border-white/50">
      <Link href={`/product/${product.id}`} className="flex flex-col flex-grow">
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#fafafa] rounded-xl mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain object-center transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
            style={{ mixBlendMode: 'multiply' }}
          />
          {product.oldPrice && (
            <div className="absolute top-3 right-3 bg-[#2E073F] text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Special Offer
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-grow px-2 pb-2">
          <div className="flex justify-between items-start mb-1.5">
            <p className="text-[10px] text-[#2E073F] uppercase tracking-[0.2em] font-bold">{product.brand}</p>
            {!product.inStock && (
              <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Out of Stock</span>
            )}
          </div>
          <h3 className="text-[13px] font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#2E073F] transition-colors leading-snug">
            {product.name}
          </h3>
          
          <div className="flex flex-col mt-auto">
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-[11px] text-gray-300 line-through font-medium leading-none mt-1">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Mini Action Bar */}
      <div className="mt-2 px-1 pb-2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <div className="px-6">
          <div className="flex items-center border rounded-full border-gray-100 h-9 bg-gray-50/50 backdrop-blur-sm">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="flex-1 text-center text-[12px] font-bold text-gray-700">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`bg-[#2E073F] text-white h-11 rounded-full flex items-center justify-center gap-3 transition-all ${
            !product.inStock 
            ? 'opacity-30 cursor-not-allowed grayscale' 
            : 'hover:bg-purple-900 active:scale-95 shadow-md'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {product.inStock ? 'Add to cart' : 'Sold Out'}
          </span>
        </button>
      </div>
    </div>
  );
}
