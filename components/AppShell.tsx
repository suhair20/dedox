"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RewardsScrollModal from "@/components/RewardsScrollModal";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { AuthProvider } from "@/context/AuthContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCheckout = pathname === "/checkout";
  const isLogin = pathname === "/login";
  const isComingSoon = pathname === "/coming-soon";
  const hideFooter = isCheckout || isLogin || isComingSoon;
  const hideNavbar = isCheckout || isLogin || isComingSoon;

  if (isComingSoon) {
    return <>{children}</>;
  }

  return (
    <LocationProvider>
      <ProductsProvider>
        <AuthProvider>
          <CartProvider>
            {!hideNavbar && <Navbar />}
            <main className={`min-w-0 flex-grow overflow-x-hidden bg-white ${hideNavbar ? "" : "pt-16 sm:pt-[4.5rem] xl:pt-20"}`}>{children}</main>
            {!hideFooter && <Footer />}
            {!hideNavbar && <RewardsScrollModal />}
          </CartProvider>
        </AuthProvider>
      </ProductsProvider>
    </LocationProvider>
  );
}
