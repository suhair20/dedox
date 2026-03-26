import type { Metadata } from "next";
import { Outfit, Cinzel_Decorative, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { CartProvider } from "@/context/CartContext";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const cinzel = Cinzel_Decorative({ weight: ["400", "700", "900"], subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Dedox Perfume | Exclusive Fragrance Collection",
  description: "A modern premium e-commerce website for the Dedox perfume brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} ${outfit.variable} ${cinzel.variable} ${inter.variable} antialiased bg-white text-gray-900 min-h-screen flex flex-col`}>
        <CartProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
