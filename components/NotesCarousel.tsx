"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Layers, Droplets, Calendar, Clock } from "lucide-react";

const CATEGORY_DATA = {
  Notes: [
    { title: "Oud", image: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=600&auto=format&fit=crop", desc: "RICH & SMOKY" },
    { title: "Jasmine", image: "https://images.unsplash.com/photo-1560963689-db8af2f6e522?q=80&w=600&auto=format&fit=crop", desc: "INTENSE & FLORAL" },
    { title: "Grapefruit", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop", desc: "BRIGHT & ZESTY" },
    { title: "Vanilla", image: "https://images.unsplash.com/photo-1615486511484-92e172054db9?q=80&w=600&auto=format&fit=crop", desc: "SWEET & COZY" },
    { title: "Rose", image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop", desc: "CLASSIC FLORAL" },
    { title: "Cedarwood", image: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=600&auto=format&fit=crop", desc: "EARTHY & WOODY" }
  ],
  Accords: [
    { title: "Fresh Aquatic", image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=600&auto=format&fit=crop", desc: "AIRY & OCEANIC" },
    { title: "Oriental Sweet", image: "https://images.unsplash.com/photo-1606314818167-17eb11244ab9?q=80&w=600&auto=format&fit=crop", desc: "RICH AMBER" },
    { title: "Woody", image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?q=80&w=600&auto=format&fit=crop", desc: "DEEP FOREST" },
    { title: "Floral", image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop", desc: "ELEGANT BLOOMS" }
  ],
  Occasion: [
    { title: "Daytime", image: "https://images.unsplash.com/photo-1596433809252-260c274590e4?q=80&w=600&auto=format&fit=crop", desc: "EFFORTLESS" },
    { title: "Evening", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop", desc: "DARK & SEDUCTIVE" },
    { title: "Office", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop", desc: "PROFESSIONAL" },
    { title: "Special", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop", desc: "HEAD-TURNING" }
  ],
  Concentration: [
    { title: "Parfum", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop", desc: "20-30% INTENSE" },
    { title: "Eau de Parfum", image: "https://images.unsplash.com/photo-1595425970377-c9703bc48b12?q=80&w=600&auto=format&fit=crop", desc: "15-20% LASTING" },
    { title: "Eau de Toilette", image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop", desc: "5-15% FRESH" },
    { title: "Cologne", image: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?q=80&w=600&auto=format&fit=crop", desc: "2-5% SPLASH" }
  ]
};

type Category = keyof typeof CATEGORY_DATA;
const categories: Category[] = ["Notes", "Accords", "Occasion", "Concentration"];

const getCategoryIcon = (cat: Category) => {
  switch(cat) {
    case "Notes": return <Layers className="w-4 h-4 mr-2" />;
    case "Accords": return <Droplets className="w-4 h-4 mr-2" />;
    case "Occasion": return <Calendar className="w-4 h-4 mr-2" />;
    case "Concentration": return <Clock className="w-4 h-4 mr-2" />;
    default: return null;
  }
}

export default function NotesCarousel() {
  const [activeCategory, setActiveCategory] = useState<Category>("Notes");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start", dragFree: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0, true);
    }
  }, [activeCategory, emblaApi]);

  return (
    <section className="w-full py-16 md:py-24 bg-[#fafafa] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Header Area */}
        <div className="flex flex-col items-center justify-center text-center mb-16 w-full max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif-luxury text-gray-900 mb-6">
            Explore Our Fragrances
          </h2>
          <p className="text-gray-600 font-inter text-base md:text-lg mb-10">
            Discover the perfect scent tailored to your unique preferences. Navigate through our curated selections below.
          </p>

          {/* Segmented Category Tabs */}
          <div className="bg-gray-100 p-1.5 rounded-full flex overflow-x-auto max-w-[90vw] md:max-w-full snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center whitespace-nowrap px-6 py-3 rounded-full font-inter text-sm md:text-base font-medium transition-all duration-300 snap-center ${
                  activeCategory === cat
                    ? "bg-[#2E073F] text-white shadow-xl scale-105"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {getCategoryIcon(cat)}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Embla Carousel Viewport */}
        <div className="relative max-w-7xl mx-auto mt-6">
          
          {/* Left Arrow (Floating over image on mobile too) */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`absolute left-2 sm:left-0 top-[100px] sm:top-36 md:top-1/2 -translate-y-1/2 sm:-translate-x-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full glass-card transition-all duration-300 ${
              !canScrollPrev ? "opacity-0 pointer-events-none" : "opacity-100 hover:scale-110 text-gray-900"
            }`}
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>

          <div className="overflow-hidden py-4 -my-4" ref={emblaRef}>
            <div className="flex -ml-4 touch-pan-y">
              {CATEGORY_DATA[activeCategory].map((item, idx) => (
                <div
                  key={`${activeCategory}-${item.title}-${idx}`}
                  className="flex-[0_0_48%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-4 min-w-0" // Adjusted for mobile to show 2 cards
                >
                  {/* Clean White Card */}
                  <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col h-full group">
                    <div className="relative h-48 sm:h-64 w-full overflow-hidden shrink-0 select-none">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        draggable={false}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col items-start bg-white flex-grow justify-between">
                      <h3 className="text-lg sm:text-xl font-bold font-inter text-gray-900 leading-tight">
                        {item.title}
                      </h3>
                      <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2E073F] mt-4">
                        {item.desc} &rarr;
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow (Floating) */}
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`absolute right-2 sm:right-0 top-[100px] sm:top-36 md:top-1/2 -translate-y-1/2 sm:translate-x-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white shadow-[0_2px_15px_rgba(0,0,0,0.15)] transition-all duration-300 ${
              !canScrollNext ? "opacity-0 pointer-events-none" : "opacity-100 hover:scale-105 text-[#0b5c14]"
            }`}
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#0b5c14]" />
          </button>

        </div>

        {/* Explore Button */}
        <div className="flex justify-center mt-16">
          <button className="bg-[#2E073F] text-white px-12 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-purple-900 transition-colors shadow-lg">
            Explore All Notes
          </button>
        </div>

      </div>
    </section>
  );
}
