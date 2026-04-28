"use client";

import { Outfit, Cinzel_Decorative, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-montserrat" });
const cinzel = Cinzel_Decorative({ weight: ["400", "700", "900"], subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isCheckout = pathname === "/checkout";

  return (
    <html lang="en">
      <body className={`${outfit.className} ${outfit.variable} ${montserrat.variable} ${cinzel.variable} ${inter.variable} antialiased bg-white text-gray-900 min-h-screen flex flex-col`}>
        <LocationProvider>
          <CartProvider>
            {!isCheckout && <Navbar />}
            <main className="flex-grow">
              {children}
            </main>
            {!isCheckout && <Footer />}
          </CartProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
