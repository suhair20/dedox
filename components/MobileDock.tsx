"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, Home, LayoutGrid, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function MobileDock() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const accountHref = isAuthenticated ? "/account" : "/login";

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/shop") || pathname.startsWith("/product") || pathname.startsWith("/category");
  const isRewards = pathname.startsWith("/account/rewards");
  const isAccount =
    pathname.startsWith("/account") && !isRewards
      ? true
      : pathname === "/login";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[90] px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-0 md:hidden"
      aria-label="Phone menu"
    >
      <div className="relative mx-auto flex h-[3.65rem] max-w-md items-end justify-between rounded-[1.6rem] border border-[#7a0c0c]/10 bg-[#1a0505] px-3 pb-2 shadow-[0_-12px_40px_rgba(26,5,5,0.28)]">
        <DockLink href="/" label="Home" active={isHome}>
          <Home className="h-[1.15rem] w-[1.15rem]" />
        </DockLink>

        <Link
          href="/shop"
          className="-mt-7 flex flex-col items-center"
          aria-label="Shop"
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white shadow-[0_10px_24px_rgba(122,12,12,0.4)] ${
              isShop ? "bg-[#7a0c0c]" : "bg-[#7a0c0c]"
            }`}
          >
            <LayoutGrid className="h-6 w-6 text-white" />
          </span>
          <span className={`mt-0.5 text-[9px] font-bold ${isShop ? "text-amber-200" : "text-white/70"}`}>
            Shop
          </span>
        </Link>

        <DockLink href="/account/rewards" label="Rewards" active={isRewards}>
          <Gift className="h-[1.15rem] w-[1.15rem]" />
        </DockLink>

        <DockLink href={accountHref} label={isAuthenticated ? "Account" : "Login"} active={isAccount}>
          <User className="h-[1.15rem] w-[1.15rem]" />
        </DockLink>
      </div>
    </nav>
  );
}

function DockLink({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex min-w-[3.5rem] flex-col items-center gap-0.5 pb-1 ${
        active ? "text-amber-200" : "text-white/65"
      }`}
    >
      {children}
      <span className="text-[9px] font-bold">{label}</span>
    </Link>
  );
}
