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
    <Link href={href} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-64">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#fafafa] text-sm font-medium text-gray-400">
              {item.name}
            </div>
          )}
        </div>
        <div className="flex flex-grow flex-col justify-between bg-white p-4 sm:p-5">
          <h3 className="text-lg font-bold leading-tight text-gray-900 sm:text-xl">
            {item.name}
          </h3>
          {subtitle && (
            <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a0c0c]">
              {subtitle} &rarr;
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
