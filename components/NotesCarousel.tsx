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
    fetch("/api/catalog/featured", { cache: "no-store" })
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
    <section className="home-section w-full overflow-hidden">
      <div className="home-section-inner">
        <div className="home-section-header mx-auto flex w-full max-w-3xl flex-col items-center justify-center">
          <h2 className="home-section-title">Explore Our Fragrances</h2>
          <p className="home-section-subtitle mb-6 sm:mb-8">
            Begin with what you love to smell. Browse by note, accord, occasion,
            or concentration — oud or rose, woody or fresh, office or evening,
            parfum or eau de parfum — then open the shop already filtered to
            that world.
          </p>

          <div className="flex w-full max-w-full snap-x overflow-x-auto rounded-full bg-gray-100 p-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:w-auto sm:max-w-full sm:p-1.5 [&::-webkit-scrollbar]:hidden">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex shrink-0 snap-center items-center whitespace-nowrap rounded-full px-3 py-2 font-inter text-[11px] font-medium transition-all duration-300 sm:px-6 sm:py-3 sm:text-sm md:text-base ${
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

        <div className="relative mx-auto mt-2 max-w-7xl sm:mt-4">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full glass-card transition-all duration-300 sm:left-0 sm:h-12 sm:w-12 sm:-translate-x-1/2 ${
              !canScrollPrev ? "pointer-events-none opacity-0" : "opacity-100 hover:scale-110"
            }`}
          >
            <ArrowLeft className="h-4 w-4 text-gray-900 sm:h-5 sm:w-5" />
          </button>

          <div className="-my-4 min-h-[260px] overflow-hidden py-4 sm:min-h-[380px] lg:min-h-[420px]" ref={emblaRef}>
            <div className="-ml-3 flex touch-pan-y sm:-ml-4">
              {activeItems.length === 0 ? (
                <div className="flex-[0_0_100%] pl-3 sm:pl-4">
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-400 sm:p-12">
                    No featured {activeConfig.label.toLowerCase()} yet. In Admin → {activeConfig.label}, create items and tick &quot;Featured on homepage&quot;.
                  </div>
                </div>
              ) : (
                activeItems.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-0 flex-[0_0_44%] pl-3 sm:flex-[0_0_48%] sm:pl-4 md:flex-[0_0_33.33%] lg:flex-[0_0_25%]"
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
            className={`absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_15px_rgba(0,0,0,0.15)] transition-all duration-300 sm:right-0 sm:h-12 sm:w-12 sm:translate-x-1/2 ${
              !canScrollNext ? "pointer-events-none opacity-0" : "opacity-100 hover:scale-105"
            }`}
          >
            <ArrowRight className="h-4 w-4 text-[#7a0c0c] sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="mt-8 flex justify-center px-2 sm:mt-10">
          <Link
            href="/shop"
            className="btn-primary max-w-full rounded-full px-6 py-3 text-center text-xs font-bold uppercase tracking-wider shadow-lg transition-colors sm:px-12 sm:py-3.5 sm:text-sm"
          >
            Explore All {activeConfig.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
