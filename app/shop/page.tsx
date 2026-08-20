import type { Metadata } from "next";
import ShopView from "@/components/shop/ShopView";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop Luxury Perfumes",
  description:
    "Browse the dedoxperfume collection — original luxury fragrances for men, women, and unisex, with prices in AED and UAE delivery.",
  alternates: {
    canonical: `${SITE_URL}/shop`,
  },
  openGraph: {
    title: "Shop Luxury Perfumes | dedoxperfume",
    description:
      "Browse original luxury fragrances for men, women, and unisex. Fast UAE delivery.",
    url: `${SITE_URL}/shop`,
  },
};

export default function ShopPage() {
  return <ShopView />;
}
