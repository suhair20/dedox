"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  /** Unique line id — productId, or productId__sizeKey when a size is chosen */
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sizeKey?: string;
  sizeLabel?: string;
}

interface CartContextType {
  cart: CartItem[];
  /** False until localStorage cart has been read (avoids empty-cart flash redirects). */
  cartReady: boolean;
  addToCart: (
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
      sizeKey?: string;
      sizeLabel?: string;
    },
    quantity: number
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function lineId(productId: string, sizeKey?: string) {
  return sizeKey ? `${productId}__${sizeKey}` : productId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("dedox_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as CartItem[];
        setCart(
          parsed.map((item) => ({
            ...item,
            productId: item.productId || item.id.split("__")[0],
          }))
        );
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    localStorage.setItem("dedox_cart", JSON.stringify(cart));
  }, [cart, cartReady]);

  const addToCart = (
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
      sizeKey?: string;
      sizeLabel?: string;
    },
    quantity: number
  ) => {
    const id = lineId(product.id, product.sizeKey);
    const displayName = product.sizeLabel
      ? `${product.name} (${product.sizeLabel})`
      : product.name;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prevCart,
        {
          id,
          productId: product.id,
          name: displayName,
          price: product.price,
          image: product.image,
          quantity,
          sizeKey: product.sizeKey,
          sizeLabel: product.sizeLabel,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartReady,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
