"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity);
  };

  return (
    <div className="group relative bg-white transition-all duration-300 flex flex-col h-full">
      <Link href={`/product/${product.id}`} className="flex flex-col flex-grow">
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-white mb-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
            style={{ mixBlendMode: 'multiply' }}
          />
          {product.oldPrice && (
            <div className="absolute top-0 right-0 bg-[#0f3d3e] text-white text-[9px] font-bold px-2 py-1 uppercase tracking-tighter">
              Sale
            </div>
          )}
          {product.brand === "Xerjoff" && (
            <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm text-[8px] font-bold px-2 py-0.5 rounded-full border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
              PREVIOUSLY VIEWED
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-grow px-1">
          <div className="flex justify-between items-start mb-0.5">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.15em] font-medium truncate pr-2">{product.brand}</p>
            {!product.inStock && (
              <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">Sold Out</span>
            )}
          </div>
          <h3 className="text-xs font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-[#0f3d3e] transition-colors leading-tight">{product.name}</h3>
          
          <div className="flex items-center space-x-1.5 mt-auto">
            <span className="text-xs font-bold text-[#0f3d3e]">Dhs. {product.price}.00</span>
            {product.oldPrice && (
              <span className="text-[10px] text-gray-300 line-through font-medium">Dhs. {product.oldPrice}.00</span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Mini Action Bar */}
      <div className="mt-4 px-1 pb-2 flex flex-col  gap-1.5  duration-300">
        <div className="px-10" >
        <div className="flex items-center border rounded-lg  border-gray-300 h-8">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="flex-1 text-center text-[11px] font-bold text-gray-700">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`bg-gradient-to-tr from-blue-950 via-black to-blue-950 text-white h-10 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-black ${!product.inStock ? 'opacity-30 cursor-not-allowed grayscale' : 'active:scale-95'}`}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{product.inStock ? 'Add to cart' : 'Sold Out'}</span>
        </button>
      </div>
    </div>
  );
}
