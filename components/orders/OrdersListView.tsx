"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
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
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "shipped":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "delivered":
      return "bg-[#7a0c0c]/8 text-[#7a0c0c] border-[#7a0c0c]/15";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
}

export default function OrdersListView() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/my", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7a0c0c]/20 border-t-[#7a0c0c]" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#7a0c0c]/8 text-[#7a0c0c]">
          <Package className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No orders yet</h2>
        <p className="mt-3 text-sm text-gray-500">
          When you place an order, it will appear here with live status updates.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-[22px] btn-primary px-8 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            href={`/account/orders/${order._id}`}
            className="group block rounded-[28px] border border-gray-100 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-[#7a0c0c]/20 hover:shadow-[0_20px_60px_rgba(122,12,12,0.08)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                  #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                </p>
                <p className="mt-2 text-lg font-bold text-gray-900">
                  {formatOrderMoney(order.total, order.currency || "AED")}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {formatOrderDate(order._createdAt)}
                  {order.itemCount ? ` · ${order.itemCount} item${order.itemCount === 1 ? "" : "s"}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] ${statusBadgeClass(order.status || "pending")}`}
                >
                  {order.status || "pending"}
                </span>
                <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#7a0c0c] opacity-0 transition group-hover:opacity-100">
                  Track
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
