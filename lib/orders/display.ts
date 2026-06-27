import type { OrderStatus } from "./types";

export const ORDER_TRACKER_STEPS = [
  {
    key: "pending" as const,
    label: "Order Placed",
    description: "We received your order",
  },
  {
    key: "processing" as const,
    label: "Processing",
    description: "Your fragrances are being prepared",
  },
  {
    key: "shipped" as const,
    label: "Shipped",
    description: "Your order is on the way",
  },
  {
    key: "delivered" as const,
    label: "Delivered",
    description: "Enjoy your collection",
  },
];

export const STATUS_PROGRESS: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

export function getStatusProgressIndex(status: string) {
  return STATUS_PROGRESS[status?.toLowerCase()] ?? 0;
}

export function getStatusHeadline(status: string) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Your order is confirmed";
    case "processing":
      return "We're preparing your order";
    case "shipped":
      return "Your order is on the way";
    case "delivered":
      return "Delivered — enjoy your fragrances";
    case "cancelled":
      return "This order was cancelled";
    default:
      return "Tracking your order";
  }
}

export function getStatusUpdateMessage(
  previous: string,
  current: string
): string | null {
  if (previous === current) return null;

  switch (current.toLowerCase()) {
    case "processing":
      return "Great news — your order is now being processed!";
    case "shipped":
      return "Your order has shipped!";
    case "delivered":
      return "Your order has been delivered!";
    case "cancelled":
      return "This order has been cancelled.";
    default:
      return `Order status updated to ${current}.`;
  }
}

export function formatOrderDate(value: string) {
  return new Date(value).toLocaleString("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatOrderMoney(amount: number | undefined, currency = "AED") {
  return `${currency} ${(amount ?? 0).toFixed(2)}`;
}

export const PAYMENT_LABELS: Record<string, string> = {
  card: "Credit / Debit Card",
  upi: "UPI / Digital Wallet",
  paypal: "PayPal",
  cod: "Cash on Delivery",
};

export const SHIPPING_LABELS: Record<string, string> = {
  standard: "Standard (3–5 days)",
  express: "Express (1–2 days)",
};

export function isTerminalStatus(status: string) {
  const value = status.toLowerCase() as OrderStatus;
  return value === "delivered" || value === "cancelled";
}
