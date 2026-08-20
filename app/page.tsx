import type { Metadata } from "next";
import Hero from "@/components/Hero";
import NotesCarousel from "@/components/NotesCarousel";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import BestSelling from "@/components/BestSelling";
import ShopByBrand from "@/components/ShopByBrand";
import ShopByPrice from "@/components/ShopByPrice";
import LoyaltyTeaser from "@/components/LoyaltyTeaser";
import ReviewsTeaser from "@/components/reviews/ReviewsTeaser";
import Features from "@/components/Features";
import FloatingButtons from "@/components/FloatingButtons";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

export default function Home() {
  return (
    <div className="flex w-full min-w-0 flex-col overflow-x-hidden bg-[#ffffff]">
      <Hero />
      <NotesCarousel />
      <ShopByPrice />
      <FeaturedProducts />
      <LoyaltyTeaser />
      <ReviewsTeaser />
      <ShopByBrand />
      <BestSelling />
      <Categories />
      <Features />
      <FloatingButtons />
    </div>
  );
}
