"use client";

import Link from "next/link";
import Image from "next/image";
import type { CatalogAttribute } from "@/lib/catalogTypes";

type CatalogAttributeCardProps = {
  item: CatalogAttribute;
  href: string;
  subtitle?: string;
};

export default function CatalogAttributeCard({
  item,
  href,
  subtitle,
}: CatalogAttributeCardProps) {
  return (
    <Link href={href} className="group block h-full min-w-0">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:rounded-[20px]">
        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden sm:aspect-auto sm:h-72 lg:h-80">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 44vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-white text-xs font-medium text-gray-400 sm:text-sm">
              {item.name}
            </div>
          )}
        </div>
        <div className="flex min-h-[4.25rem] flex-grow flex-col justify-between bg-white p-3 sm:min-h-[6rem] sm:p-5 md:p-6">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 sm:text-lg md:text-xl">
            {item.name}
          </h3>
          {subtitle && (
            <div className="mt-2 truncate text-[9px] font-bold uppercase tracking-[0.18em] text-[#7a0c0c] sm:mt-4 sm:text-[10px] sm:tracking-[0.2em]">
              {subtitle} &rarr;
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
