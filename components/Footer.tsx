import Link from "next/link";
import { MessageCircle, Share2, Globe } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-[#981212]/30 bg-gradient-to-tr from-[#4a0808] via-[#7a0c0c] to-[#4a0808] text-white">
      <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 space-y-5 md:col-span-1 md:space-y-6">
            <Logo className="-ml-4 !items-start scale-90" />
            <p className="max-w-xs text-sm leading-relaxed text-gray-300">
              Discover the essence of luxury with our exclusive fragrance collection crafted for elegance and style.
            </p>
          </div>
          <div className="min-w-0">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white sm:mb-4 sm:text-sm">Shop</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Men&apos;s Fragrances</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Women&apos;s Fragrances</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Unisex Collection</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Gift Sets</Link></li>
            </ul>
          </div>
          <div className="min-w-0">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white sm:mb-4 sm:text-sm">Company</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">About Us</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Contact</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-[#fca5a5]">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="col-span-2 min-w-0 md:col-span-1">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white sm:mb-4 sm:text-sm">Follow</h4>
            <p className="mb-4 max-w-sm text-sm text-gray-200">Stay updated with our latest collections and offers.</p>
            <div className="flex space-x-3 sm:space-x-4">
              <Link href="#" className="text-gray-200 hover:text-[#fca5a5] transition-colors p-2 -ml-2 rounded-full hover:bg-white/10">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#fca5a5] transition-colors p-2 rounded-full hover:bg-white/10">
                <Share2 className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#fca5a5] transition-colors p-2 rounded-full hover:bg-white/10">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col items-center justify-between sm:flex-row gap-4">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Dedox Perfume. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Designed for luxury
          </p>
        </div>
      </div>
    </footer>
  );
}
