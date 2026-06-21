import Link from "next/link";
import { MessageCircle, Share2, Globe } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-[#981212]/30 bg-gradient-to-tr from-[#4a0808] via-[#7a0c0c] to-[#4a0808] text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          <div className="space-y-6">
            <Logo className="!items-start scale-90 -ml-4" />
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
              Discover the essence of luxury with our exclusive fragrance collection crafted for elegance and style.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-300 hover:text-[#fca5a5] transition-colors">Men&apos;s Fragrances</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-[#fca5a5] transition-colors">Women&apos;s Fragrances</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-[#fca5a5] transition-colors">Unisex Collection</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-[#fca5a5] transition-colors">Gift Sets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-300 hover:text-[#fca5a5] transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-[#fca5a5] transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-[#fca5a5] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-[#fca5a5] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Follow</h4>
            <p className="text-sm text-gray-200 mb-4">Stay updated with our latest collections and offers.</p>
            <div className="flex space-x-4">
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
