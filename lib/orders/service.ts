import "server-only";

import { client } from "@/lib/sanity";
import {
  CUSTOMER_ORDER_PROJECTION,
  CUSTOMER_ORDERS_LIST_PROJECTION,
} from "./queries";
import type { CustomerOrder } from "./types";

type OrderListItem = {
  _id: string;
  _createdAt: string;
  orderNumber?: string;
  status?: string;
  total?: number;
  currency?: string;
  itemCount?: number;
};

type OrderRecord = CustomerOrder & { userId?: string };

export async function listCustomerOrders(
  userId: string
): Promise<OrderListItem[]> {
  const orders = await client.fetch<OrderListItem[]>(
    `*[_type == "order" && user._ref == $userId] | order(_createdAt desc) ${CUSTOMER_ORDERS_LIST_PROJECTION}`,
    { userId }
  );
  return Array.isArray(orders) ? orders : [];
}

export async function getCustomerOrder(
  userId: string,
  orderId: string
): Promise<CustomerOrder | null> {
  const order = await client.fetch<OrderRecord | null>(
    `*[_type == "order" && _id == $id][0] ${CUSTOMER_ORDER_PROJECTION}`,
    { id: orderId }
  );

  if (!order || order.userId !== userId) {
    return null;
  }

  const safeOrder = { ...order };
  delete safeOrder.userId;
  return safeOrder;
}
