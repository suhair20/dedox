import type { Metadata } from "next";
import Image from "next/image";
import { SITE_LOGO, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: `${SITE_NAME} is launching soon.`,
  // This page is only for visitors. Google is sent to the real shop instead.
  robots: { index: false, follow: true },
};

export default function ComingSoonPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#111111] px-6 py-16 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(122,12,12,0.35)_0%,_transparent_55%)]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#7a0c0c]/20 blur-3xl" />

      <div className="relative z-10 max-w-lg">
        <div className="mx-auto mb-8 flex h-20 w-48 items-center justify-center">
          <Image
            src={SITE_LOGO}
            alt={SITE_NAME}
            width={180}
            height={72}
            className="h-auto w-full brightness-0 invert"
            priority
          />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FFD700]">
          Coming Soon
        </p>
        <h1 className="mt-4 font-serif-luxury text-4xl font-bold tracking-tight sm:text-5xl">
          Something exquisite is on the way
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/70">
          We are putting the finishing touches on {SITE_NAME}. Our luxury
          fragrance collection will be available very soon.
        </p>

        <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/80 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#22C55E]" />
          Launching shortly
        </div>
      </div>
    </div>
  );
}
