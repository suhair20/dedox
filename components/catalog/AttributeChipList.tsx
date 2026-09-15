import Link from "next/link";
import type { CatalogAttribute } from "@/lib/catalogTypes";

type AttributeChipListProps = {
  title: string;
  items?: CatalogAttribute[];
  shopParam: "note" | "accord" | "occasion" | "concentration" | "brand" | "category";
  emptyLabel?: string;
};

export default function AttributeChipList({
  title,
  items,
  shopParam,
  emptyLabel = "Not specified",
}: AttributeChipListProps) {
  if (!items?.length) {
    return (
      <div className="min-w-0">
        <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-900 sm:text-[11px]">
          {title}
        </h4>
        <p className="text-xs text-gray-400 sm:text-sm">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-900 sm:mb-3 sm:text-[11px]">
        {title}
      </h4>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/shop?${shopParam}=${encodeURIComponent(item.slug)}`}
            className="max-w-full truncate rounded-full border border-[#7a0c0c]/15 bg-[#7a0c0c]/5 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7a0c0c] transition hover:bg-[#7a0c0c] hover:text-white sm:px-4 sm:py-2 sm:text-xs"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
