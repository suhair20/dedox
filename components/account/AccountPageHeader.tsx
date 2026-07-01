import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type AccountPageHeaderProps = {
  backHref?: string;
  backLabel?: string;
  title: string;
  description?: string;
};

export default function AccountPageHeader({
  backHref,
  backLabel = "Back",
  title,
  description,
}: AccountPageHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:border-[#7a0c0c]/20 hover:text-[#7a0c0c]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {backLabel}
        </Link>
      ) : null}
      <h1
        className={`font-serif-luxury text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl ${
          backHref ? "mt-4" : ""
        }`}
      >
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      ) : null}
    </header>
  );
}
