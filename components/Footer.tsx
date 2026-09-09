import Link from "next/link";
import Logo from "./Logo";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-[#981212]/30 bg-gradient-to-tr from-[#4a0808] via-[#7a0c0c] to-[#4a0808] text-white">
      <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 space-y-5 md:col-span-1 md:space-y-6">
            <Logo className="-ml-4 !items-start scale-90" />
            <p className="max-w-xs text-sm leading-relaxed text-gray-300">
              Dedox is a UAE house of original luxury fragrance. We curate
              bottles for presence, longevity, and the climate we live in —
              so every order arrives authentic, sealed, and ready to wear.
            </p>
          </div>
          <div className="min-w-0">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white sm:mb-4 sm:text-sm">Shop</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li><Link href="/shop" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Shop all</Link></li>
              <li><Link href="/shop?category=men" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Men&apos;s Fragrances</Link></li>
              <li><Link href="/shop?category=women" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Women&apos;s Fragrances</Link></li>
              <li><Link href="/shop?category=unisex" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Unisex Collection</Link></li>
            </ul>
          </div>
          <div className="min-w-0">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white sm:mb-4 sm:text-sm">Company</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li><Link href="/about" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Signature</Link></li>
              <li><Link href="/reviews" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Reviews</Link></li>
              <li><Link href="/account/rewards" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Rewards</Link></li>
            </ul>
          </div>
          <div className="col-span-2 min-w-0 md:col-span-1">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white sm:mb-4 sm:text-sm">Follow</h4>
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-gray-200">
              Follow for new arrivals, private edits, and Rewards drops — the
              next bottle often appears here first.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full max-w-xs items-center gap-3 rounded-full border border-white/20 bg-white px-4 py-3 text-[#7a0c0c] shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.03] hover:bg-[#fff5f5]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7a0c0c] text-white">
                <InstagramIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#7a0c0c]/70">
                  Instagram
                </span>
                <span className="block truncate text-sm font-bold">@{INSTAGRAM_HANDLE}</span>
              </span>
            </a>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col items-center justify-between sm:flex-row gap-4">
          <p className="text-sm text-gray-300">
          &copy; {new Date().getFullYear()} dedoxperfume. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Designed for luxury
          </p>
        </div>
      </div>
    </footer>
  );
}
