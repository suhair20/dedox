"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { formatOrderDate, formatOrderMoney } from "@/lib/orders/display";

type OrderListItem = {
  _id: string;
  _createdAt: string;
  orderNumber?: string;
  status?: string;
  total?: number;
  currency?: string;
  itemCount?: number;
};

function statusBadgeClass(status: string) {
  switch (status?.toLowerCase()) {
    case "processing":
      return "bg-amber-50 text-amber-800 border-amber-100";
    case "shipped":
      return "bg-sky-50 text-sky-800 border-sky-100";
    case "delivered":
      return "bg-[#7a0c0c]/10 text-[#7a0c0c] border-[#7a0c0c]/15";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
}

function statusLabel(status: string) {
  const s = status?.toLowerCase() || "pending";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type OrdersListViewProps = {
  initialOrders: OrderListItem[];
};

export default function OrdersListView({ initialOrders }: OrdersListViewProps) {
  const [orders] = useState<OrderListItem[]>(initialOrders);

  if (orders.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-dashed border-[#7a0c0c]/20 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,12,12,0.06)_0%,_transparent_70%)]" />
        <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7a0c0c] to-[#5a0808] text-white shadow-lg">
          <Package className="h-7 w-7" />
        </div>
        <h2 className="relative font-serif-luxury text-xl font-bold text-gray-900 sm:text-2xl">
          No orders yet
        </h2>
        <p className="relative mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
          When you find your signature scent, your orders will live here with live tracking.
        </p>
        <Link
          href="/shop"
          className="relative mt-7 inline-flex items-center gap-2 rounded-xl btn-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(122,12,12,0.25)] transition hover:scale-[1.02]"
        >
          <ShoppingBag className="h-4 w-4" />
          Explore fragrances
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order, index) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06, duration: 0.35 }}
        >
          <Link
            href={`/account/orders/${order._id}`}
            className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7a0c0c]/20 hover:shadow-[0_16px_40px_rgba(122,12,12,0.1)] sm:p-5"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#7a0c0c] to-[#7a0c0c]/30 opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 pl-0 sm:pl-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                  </p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:hidden ${statusBadgeClass(order.status || "pending")}`}
                  >
                    {statusLabel(order.status || "pending")}
                  </span>
                </div>
                <p className="mt-1.5 font-serif-luxury text-xl font-bold text-gray-900 sm:text-2xl">
                  {formatOrderMoney(order.total, order.currency || "AED")}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {formatOrderDate(order._createdAt)}
                  {order.itemCount
                    ? ` · ${order.itemCount} fragrance${order.itemCount === 1 ? "" : "s"}`
                    : ""}
                </p>
              </div>

              <div className="flex w-full items-center justify-between gap-3 border-t border-gray-50 pt-3 sm:w-auto sm:border-0 sm:pt-0">
                <span
                  className={`hidden rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide sm:inline-flex ${statusBadgeClass(order.status || "pending")}`}
                >
                  {statusLabel(order.status || "pending")}
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-[#7a0c0c] transition group-hover:gap-2.5">
                  Track order
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
