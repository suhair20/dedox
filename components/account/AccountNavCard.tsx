import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

type AccountNavCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  featured?: boolean;
};

export default function AccountNavCard({
  href,
  icon: Icon,
  title,
  description,
  featured = false,
}: AccountNavCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:h-full sm:flex-col sm:items-start sm:gap-3 sm:p-6 ${
        featured
          ? "border-[#7a0c0c]/20 bg-gradient-to-br from-[#7a0c0c] to-[#5a0808] text-white shadow-[0_16px_40px_rgba(122,12,12,0.22)] hover:shadow-[0_20px_50px_rgba(122,12,12,0.28)] hover:-translate-y-0.5"
          : "border-gray-100 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] hover:border-[#7a0c0c]/15 hover:shadow-[0_12px_40px_rgba(122,12,12,0.08)] hover:-translate-y-0.5"
      }`}
    >
      {featured && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      )}
      <div
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${
          featured
            ? "bg-white/15 text-white"
            : "bg-[#7a0c0c]/8 text-[#7a0c0c]"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="relative min-w-0 flex-1">
        <p
          className={`text-sm font-semibold sm:text-base ${
            featured ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </p>
        <p
          className={`mt-0.5 text-xs leading-5 sm:text-sm ${
            featured ? "text-white/70" : "text-gray-500"
          }`}
        >
          {description}
        </p>
      </div>
      <ChevronRight
        className={`relative ml-auto h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 sm:ml-0 sm:mt-auto ${
          featured ? "text-white/80" : "text-gray-300 group-hover:text-[#7a0c0c]"
        }`}
      />
    </Link>
  );
}
