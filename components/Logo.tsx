"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export default function Logo({ className = "", compact = false }: LogoProps) {
  const sizeClass = compact
    ? "w-32 h-14 sm:w-36 sm:h-16 md:w-40 md:h-[4.25rem] xl:w-48 xl:h-20"
    : "w-32 h-16 md:w-40 md:h-16 lg:w-48 lg:h-20";

  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center group transition-all duration-500 ease-out hover:scale-105 ${className}`}
    >
      <div className={`relative ${sizeClass}`}>
        <Image
          src="/dedox logo new-01.svg"
          alt="Dedox"
          fill
          className="object-contain transition-all duration-700 brightness-[1.1] contrast-[1.05] group-hover:scale-110 group-hover:brightness-[1.2]"
          priority
        />
      </div>
    </Link>
  );
}
