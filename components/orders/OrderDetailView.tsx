"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";
import OrderStatusTracker from "@/components/orders/OrderStatusTracker";
import type { CustomerOrder } from "@/lib/orders/types";
import {
  PAYMENT_LABELS,
  SHIPPING_LABELS,
  formatOrderDate,
  formatOrderMoney,
  getStatusHeadline,
  getStatusUpdateMessage,
  isTerminalStatus,
} from "@/lib/orders/display";

const POLL_INTERVAL_MS = 5000;

type OrderDetailViewProps = {
  orderId: string;
};

export default function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [animateKey, setAnimateKey] = useState(0);
  const previousStatusRef = useRef<string | null>(null);

  const fetchOrder = useCallback(async (silent = false) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
      if (!res.ok) {
        if (!silent) {
          setError(res.status === 404 ? "Order not found." : "Failed to load order.");
        }
        return;
      }

      const data = (await res.json()) as CustomerOrder;
      const previousStatus = previousStatusRef.current;

      if (previousStatus && previousStatus !== data.status) {
        const message = getStatusUpdateMessage(previousStatus, data.status);
        if (message) {
          setStatusNotice(message);
          setAnimateKey((value) => value + 1);
        }
      }

      previousStatusRef.current = data.status;
      setOrder(data);
      setError("");
    } catch {
      if (!silent) setError("Failed to load order.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    if (!order || isTerminalStatus(order.status)) return;

    const intervalId = window.setInterval(() => {
      fetchOrder(true);
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [order, fetchOrder]);

  useEffect(() => {
    if (!statusNotice) return;
    const timeoutId = window.setTimeout(() => setStatusNotice(null), 6000);
    return () => window.clearTimeout(timeoutId);
  }, [statusNotice]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7a0c0c]/20 border-t-[#7a0c0c]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-[32px] border border-gray-100 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-bold text-gray-900">{error || "Order not found."}</p>
        <Link
          href="/account/orders"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#7a0c0c]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
      </div>
    );
  }

  const currency = order.currency || "AED";
  const address = order.shippingAddress;

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {statusNotice && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="flex items-center gap-3 rounded-[24px] border border-[#7a0c0c]/15 bg-[#7a0c0c]/8 px-5 py-4 text-[#7a0c0c] shadow-[0_16px_40px_rgba(122,12,12,0.12)]"
          >
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="h-5 w-5 shrink-0" />
            </motion.div>
            <p className="text-sm font-semibold sm:text-base">{statusNotice}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
              Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
            </p>
            <motion.h1
              key={`headline-${order.status}-${animateKey}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 font-serif-luxury text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              {getStatusHeadline(order.status)}
            </motion.h1>
            <p className="mt-3 text-sm text-gray-500">
              Placed on {formatOrderDate(order._createdAt)}
            </p>
          </div>

          <motion.div
            key={`badge-${order.status}-${animateKey}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex self-start rounded-full border border-[#7a0c0c]/15 bg-[#7a0c0c]/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#7a0c0c]"
          >
            {order.status}
          </motion.div>
        </div>
      </div>

      <OrderStatusTracker status={order.status} animateKey={animateKey} />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
            Items
          </h2>
          <div className="mt-6 space-y-5">
            {(order.items || []).map((item, index) => (
              <div
                key={item._key || `${item.productId}-${index}`}
                className="flex items-center gap-4 rounded-[24px] border border-gray-50 bg-[#fcfbfd] p-4"
              >
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold uppercase tracking-wide text-gray-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Qty {item.quantity ?? 1}</p>
                </div>
                <p className="text-sm font-bold text-[#7a0c0c]">
                  {formatOrderMoney((item.price ?? 0) * (item.quantity ?? 1), currency)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
              Summary
            </h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <dt>Subtotal</dt>
                <dd>{formatOrderMoney(order.subtotal, currency)}</dd>
              </div>
              <div className="flex justify-between text-gray-500">
                <dt>Shipping</dt>
                <dd>{formatOrderMoney(order.shippingCost, currency)}</dd>
              </div>
              <div className="flex justify-between text-gray-500">
                <dt>Tax</dt>
                <dd>{formatOrderMoney(order.tax, currency)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-4 text-base font-bold text-gray-900">
                <dt>Total</dt>
                <dd className="text-[#7a0c0c]">{formatOrderMoney(order.total, currency)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
              Delivery
            </h2>
            <div className="mt-5 space-y-4 text-sm text-gray-600">
              <p>
                <span className="font-semibold text-gray-900">Shipping: </span>
                {SHIPPING_LABELS[order.shippingMethod || "standard"] || order.shippingMethod}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Payment: </span>
                {PAYMENT_LABELS[order.paymentMethod || "card"] || order.paymentMethod}
              </p>
              {address && (
                <div className="flex gap-3 rounded-[22px] bg-[#fcfbfd] p-4">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7a0c0c]" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="mt-1 leading-6">
                      {address.streetAddress}
                      <br />
                      {address.city}
                      {address.postalCode ? `, ${address.postalCode}` : ""}
                      <br />
                      {address.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
