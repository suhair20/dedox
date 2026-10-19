"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RewardsScrollModal from "@/components/RewardsScrollModal";
import MobileDock from "@/components/MobileDock";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { AuthProvider } from "@/context/AuthContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isBrands = pathname === "/brands";
  const flushHero = isHome || isBrands;
  const isCheckout = pathname === "/checkout";
  const isLogin = pathname === "/login";
  const hideFooter = isCheckout || isLogin;
  const hideNavbar = isCheckout || isLogin;

  return (
    <LocationProvider>
      <ProductsProvider>
        <AuthProvider>
          <CartProvider>
            {!hideNavbar && <Navbar transparentOnTop={flushHero} />}
            <main
              className={`min-w-0 flex-grow overflow-x-clip bg-[#faf6f5] ${
                hideNavbar ? "" : flushHero ? "pb-24 md:pb-0" : "pt-16 pb-24 sm:pt-[4.5rem] md:pb-0 xl:pt-20"
              }`}
            >
              {children}
            </main>
            {!hideFooter && <Footer />}
            {!hideNavbar && <RewardsScrollModal />}
            {!hideNavbar && <MobileDock />}
          </CartProvider>
        </AuthProvider>
      </ProductsProvider>
    </LocationProvider>
  );
}
