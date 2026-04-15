"use client";

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link 
      href="/" 
      className={`inline-flex items-center group transition-all duration-500 ease-out hover:scale-110 ${className}`}
    >
      <div className="relative w-32 h-12 md:w-40 md:h-16 lg:w-48 lg:h-20">
        <Image
          src="DX LOGO - PNG FILE-01.svg"
          alt="Dedox"
          fill
          className="object-contain transition-all duration-700 brightness-[1.1] contrast-[1.05] group-hover:scale-110 group-hover:brightness-[1.2]"
          priority
        />
      </div>
    </Link>
  );
}
