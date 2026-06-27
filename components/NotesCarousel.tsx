"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Layers, Droplets, Calendar, Clock } from "lucide-react";
import CatalogAttributeCard from "@/components/catalog/CatalogAttributeCard";
import type { CatalogAttribute } from "@/lib/catalogTypes";

type TabKey = "notes" | "accords" | "occasions" | "concentrations";

type FeaturedCatalog = Record<TabKey, CatalogAttribute[]>;

const TAB_CONFIG: Array<{
  key: TabKey;
  label: string;
  shopParam: "note" | "accord" | "occasion" | "concentration";
  icon: React.ReactNode;
}> = [
  { key: "notes", label: "Notes", shopParam: "note", icon: <Layers className="mr-2 h-4 w-4" /> },
  { key: "accords", label: "Accords", shopParam: "accord", icon: <Droplets className="mr-2 h-4 w-4" /> },
  { key: "occasions", label: "Occasions", shopParam: "occasion", icon: <Calendar className="mr-2 h-4 w-4" /> },
  { key: "concentrations", label: "Concentrations", shopParam: "concentration", icon: <Clock className="mr-2 h-4 w-4" /> },
];

const emptyCatalog: FeaturedCatalog = {
  notes: [],
  accords: [],
  occasions: [],
  concentrations: [],
};

export default function NotesCarousel() {
  const [catalog, setCatalog] = useState<FeaturedCatalog>(emptyCatalog);
  const [activeTab, setActiveTab] = useState<TabKey>("notes");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start", dragFree: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    fetch("/api/catalog/featured")
      .then((res) => res.json())
      .then((data) => {
        setCatalog({
          notes: Array.isArray(data?.notes) ? data.notes : [],
          accords: Array.isArray(data?.accords) ? data.accords : [],
          occasions: Array.isArray(data?.occasions) ? data.occasions : [],
          concentrations: Array.isArray(data?.concentrations) ? data.concentrations : [],
        });
      })
      .catch(() => setCatalog(emptyCatalog));
  }, []);

  const activeConfig = TAB_CONFIG.find((tab) => tab.key === activeTab)!;
  const activeItems = catalog[activeTab];

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
    emblaApi?.scrollTo(0, true);
  }, [activeTab, emblaApi]);

  return (
    <section className="w-full overflow-hidden bg-[#fafafa] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 flex w-full max-w-3xl flex-col items-center justify-center text-center">
          <h2 className="mb-6 font-serif-luxury text-4xl text-gray-900 md:text-5xl lg:text-6xl">
            Explore Our Fragrances
          </h2>
          <p className="mb-10 font-inter text-base text-gray-600 md:text-lg">
            Discover scents by note, accord, occasion, and concentration — all managed from your catalog.
          </p>

          <div className="flex max-w-[90vw] snap-x overflow-x-auto rounded-full bg-gray-100 p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] md:max-w-full [&::-webkit-scrollbar]:hidden">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex snap-center items-center whitespace-nowrap rounded-full px-6 py-3 font-inter text-sm font-medium transition-all duration-300 md:text-base ${
                  activeTab === tab.key
                    ? "btn-primary scale-105 text-white shadow-xl"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-6 max-w-7xl">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`absolute left-2 top-[100px] z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full glass-card transition-all duration-300 sm:left-0 sm:top-1/2 sm:-translate-x-1/2 md:top-1/2 ${
              !canScrollPrev ? "pointer-events-none opacity-0" : "opacity-100 hover:scale-110"
            }`}
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </button>

          <div className="-my-4 overflow-hidden py-4" ref={emblaRef}>
            <div className="flex touch-pan-y -ml-4">
              {activeItems.length === 0 ? (
                <div className="flex-[0_0_100%] pl-4">
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-400">
                    No featured {activeConfig.label.toLowerCase()} yet. Add them in Dedox Admin → Catalog.
                  </div>
                </div>
              ) : (
                activeItems.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-0 flex-[0_0_48%] pl-4 md:flex-[0_0_33.33%] lg:flex-[0_0_25%]"
                  >
                    <CatalogAttributeCard
                      item={item}
                      href={`/shop?${activeConfig.shopParam}=${encodeURIComponent(item.slug)}`}
                      subtitle={item.description || "Explore"}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`absolute right-2 top-[100px] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_15px_rgba(0,0,0,0.15)] transition-all duration-300 sm:right-0 sm:top-1/2 sm:translate-x-1/2 sm:h-12 sm:w-12 md:top-1/2 ${
              !canScrollNext ? "pointer-events-none opacity-0" : "opacity-100 hover:scale-105"
            }`}
          >
            <ArrowRight className="h-4 w-4 text-[#0b5c14] sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/shop"
            className="btn-primary rounded-full px-12 py-3.5 text-sm font-bold uppercase tracking-wider shadow-lg transition-colors"
          >
            Explore All {activeConfig.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
