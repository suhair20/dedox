"use client";

import Link from "next/link";
import Image from "next/image";
import { SITE_LOGO, SITE_NAME } from "@/lib/site";

interface LogoProps {
  className?: string;
  compact?: boolean;
  light?: boolean;
}

export default function Logo({ className = "", compact = false, light = false }: LogoProps) {
  const sizeClass = compact
    ? "h-20 w-52 sm:h-20 sm:w-52 md:h-20 md:w-56 xl:h-[5.25rem] xl:w-60"
    : "w-32 h-16 md:w-40 md:h-16 lg:w-48 lg:h-20";

  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center group transition-all duration-500 ease-out hover:scale-105 ${className}`}
    >
      <div className={`relative ${sizeClass}`}>
        <Image
          src={SITE_LOGO}
          alt={SITE_NAME}
          fill
          className={`object-contain object-center transition-all duration-700 group-hover:scale-105 ${
            light ? "brightness-0 invert" : ""
          }`}
          priority
        />
      </div>
    </Link>
  );
}
