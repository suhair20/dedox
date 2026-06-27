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
      <div>
        <h4 className="mb-2 text-[11px] font-black uppercase tracking-widest text-gray-900">
          {title}
        </h4>
        <p className="text-sm text-gray-400">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-3 text-[11px] font-black uppercase tracking-widest text-gray-900">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/shop?${shopParam}=${encodeURIComponent(item.slug)}`}
            className="rounded-full border border-[#7a0c0c]/15 bg-[#7a0c0c]/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#7a0c0c] transition hover:bg-[#7a0c0c] hover:text-white"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
