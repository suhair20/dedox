import { Package, Sparkles } from "lucide-react";

type AccountOverviewProps = {
  orderCount: number;
  activeOrders: number;
};

export default function AccountOverview({
  orderCount,
  activeOrders,
}: AccountOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm">
        <div className="flex items-center gap-2 text-[#7a0c0c]">
          <Package className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Orders
          </span>
        </div>
        <p className="mt-2 font-serif-luxury text-3xl font-bold text-gray-900">
          {orderCount}
        </p>
      </div>
      <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm">
        <div className="flex items-center gap-2 text-[#7a0c0c]">
          <Sparkles className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            In progress
          </span>
        </div>
        <p className="mt-2 font-serif-luxury text-3xl font-bold text-gray-900">
          {activeOrders}
        </p>
      </div>
    </div>
  );
}
