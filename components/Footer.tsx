import Link from "next/link";
import { MessageCircle, Share2, Globe } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] border-t bg-gradient-to-tr from-blue-950 via-black to-blue-950  text-white border-gray-200">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          <div className="space-y-6">
            <Logo className="!items-start scale-90 -ml-4" />
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Discover the essence of luxury with our exclusive fragrance collection crafted for elegance and style. 
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#2E073F] transition-colors">Men&apos;s Fragrances</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#2E073F] transition-colors">Women&apos;s Fragrances</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#2E073F] transition-colors">Unisex Collection</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#2E073F] transition-colors">Gift Sets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#2E073F] transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#2E073F] transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#2E073F] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-[#2E073F] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Follow Us</h4>
            <p className="text-sm text-white mb-4">Stay updated with our latest collections and offers.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-100 hover:text-[#2E073F] transition-colors p-2 -ml-2 rounded-full hover:bg-gray-100">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#2E073F] transition-colors p-2 rounded-full hover:bg-gray-100">
                <Share2 className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#2E073F] transition-colors p-2 rounded-full hover:bg-gray-100">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col items-center justify-between sm:flex-row gap-4">
          <p className="text-sm text-gray-500">
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
