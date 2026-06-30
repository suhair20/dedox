"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { AuthProvider } from "@/context/AuthContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCheckout = pathname === "/checkout";
  const isLogin = pathname === "/login";
  const hideFooter = isCheckout || isLogin;
  const hideNavbar = isCheckout || isLogin;

  return (
    <LocationProvider>
      <ProductsProvider>
        <AuthProvider>
          <CartProvider>
            {!hideNavbar && <Navbar />}
            <main className="flex-grow">{children}</main>
            {!hideFooter && <Footer />}
          </CartProvider>
        </AuthProvider>
      </ProductsProvider>
    </LocationProvider>
  );
}
