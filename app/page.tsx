import Hero from "@/components/Hero";
import NotesCarousel from "@/components/NotesCarousel";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import BestSelling from "@/components/BestSelling";
import ShopByBrand from "@/components/ShopByBrand";
import Features from "@/components/Features";
import FloatingButtons from "@/components/FloatingButtons";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <NotesCarousel />
      <FeaturedProducts />
      <ShopByBrand />
       <BestSelling />
      <Categories />
      <Features />
      <FloatingButtons />
    </div>
  );
}
