import "server-only";

import { randomUUID } from "crypto";
import { client, getSanityWriteClient } from "@/lib/sanity";
import { EARN_STATUS, EXPIRY_DAYS } from "./config";
import { isWithinWindow, pointsFor, windowStartIso } from "./points";
import type {
  PointsHistoryItem,
  PointsSummary,
  RedemptionEntry,
  RewardProduct,
} from "./types";

type DeliveredOrderRow = {
  _id: string;
  orderNumber?: string;
  total?: number;
  _createdAt: string;
  pointsEarned?: number;
};

type UserLedgerDoc = {
  _id: string;
  pointsLedger?: RedemptionEntry[];
};

const DEFAULT_REWARD_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800";

async function getUserLedgerDoc(userId: string): Promise<UserLedgerDoc | null> {
  return client.fetch<UserLedgerDoc | null>(
    `*[_type == "user" && _id == $userId][0]{ _id, pointsLedger }`,
    { userId }
  );
}

async function listDeliveredOrdersInWindow(
  userId: string
): Promise<DeliveredOrderRow[]> {
  const since = windowStartIso();
  const orders = await client.fetch<DeliveredOrderRow[]>(
    `*[_type == "order" && user._ref == $userId && status == $status && _createdAt >= $since] | order(_createdAt desc) {
      _id,
      orderNumber,
      total,
      _createdAt,
      pointsEarned
    }`,
    { userId, status: EARN_STATUS, since }
  );
  return Array.isArray(orders) ? orders : [];
}

function earnedFromOrder(order: DeliveredOrderRow): number {
  if (typeof order.pointsEarned === "number" && order.pointsEarned >= 0) {
    return order.pointsEarned;
  }
  return pointsFor(order.total ?? 0);
}

export async function getPointsSummary(userId: string): Promise<PointsSummary> {
  const [orders, ledgerDoc] = await Promise.all([
    listDeliveredOrdersInWindow(userId),
    getUserLedgerDoc(userId),
  ]);

  const now = new Date();
  const ledger = (ledgerDoc?.pointsLedger ?? []).filter((entry) =>
    isWithinWindow(entry.createdAt, now)
  );

  const earnedActive = orders.reduce(
    (sum, order) => sum + earnedFromOrder(order),
    0
  );
  const redeemedActive = ledger.reduce(
    (sum, entry) => sum + (entry.points || 0),
    0
  );
  const balance = Math.max(0, earnedActive - redeemedActive);

  // Points from orders that fall in the last 30 days of the window (closest to expiry).
  const soonCutoff = new Date(now);
  soonCutoff.setDate(soonCutoff.getDate() - (EXPIRY_DAYS - 30));
  const expiringSoon = orders
    .filter((order) => {
      const created = new Date(order._createdAt);
      return created.getTime() <= soonCutoff.getTime();
    })
    .reduce((sum, order) => sum + earnedFromOrder(order), 0);

  const earnedHistory: PointsHistoryItem[] = [];
  for (const order of orders) {
    const pts = earnedFromOrder(order);
    if (pts <= 0) continue;
    earnedHistory.push({
      type: "earned",
      points: pts,
      label: `Order ${order.orderNumber || order._id}`,
      date: order._createdAt,
      orderNumber: order.orderNumber,
    });
  }

  const redeemedHistory: PointsHistoryItem[] = ledger.map((entry) => ({
    type: "redeemed",
    points: entry.points,
    label: entry.productName,
    date: entry.createdAt,
    orderNumber: entry.orderNumber,
  }));

  const history = [...earnedHistory, ...redeemedHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return {
    balance,
    earnedActive,
    redeemedActive,
    expiringSoon: Math.min(expiringSoon, balance),
    history: history.slice(0, 20),
  };
}

export async function listRewardProducts(): Promise<RewardProduct[]> {
  const products = await client.fetch<RewardProduct[]>(
    `*[_type == "product" && isReward == true && defined(pointsCost) && pointsCost > 0] | order(pointsCost asc) {
      _id,
      name,
      pointsCost,
      price,
      inStock,
      "imageUrl": images[0].asset->url
    }`
  );
  return Array.isArray(products) ? products : [];
}

export async function getRewardProduct(
  productId: string
): Promise<RewardProduct | null> {
  return client.fetch<RewardProduct | null>(
    `*[_type == "product" && _id == $productId && isReward == true][0]{
      _id,
      name,
      pointsCost,
      price,
      inStock,
      "imageUrl": images[0].asset->url
    }`,
    { productId }
  );
}

export async function assertCanRedeem(
  userId: string,
  productId: string
): Promise<RewardProduct> {
  const product = await getRewardProduct(productId);
  if (!product) {
    throw new Error("That reward is not available.");
  }
  if (typeof product.pointsCost !== "number" || product.pointsCost < 1) {
    throw new Error("That reward has no points cost configured.");
  }
  if (product.inStock === false) {
    throw new Error(`${product.name} is currently out of stock.`);
  }

  const summary = await getPointsSummary(userId);
  if (summary.balance < product.pointsCost) {
    throw new Error(
      `You need ${product.pointsCost} points to unlock ${product.name}. You have ${summary.balance}.`
    );
  }

  return product;
}

export async function recordRedemption(
  userId: string,
  entry: {
    points: number;
    productId: string;
    productName: string;
    orderNumber: string;
    createdAt?: string;
  }
): Promise<RedemptionEntry> {
  const writeClient = getSanityWriteClient();
  const doc = await getUserLedgerDoc(userId);
  if (!doc?._id) {
    throw new Error("User not found.");
  }

  const next: RedemptionEntry = {
    _key: randomUUID(),
    _type: "pointsRedemption",
    points: entry.points,
    productId: entry.productId,
    productName: entry.productName,
    orderNumber: entry.orderNumber,
    createdAt: entry.createdAt || new Date().toISOString(),
  };

  const ledger = [...(doc.pointsLedger ?? []), next];
  await writeClient.patch(doc._id).set({ pointsLedger: ledger }).commit();
  return next;
}

export function rewardImageUrl(product: RewardProduct): string {
  return product.imageUrl || DEFAULT_REWARD_IMAGE;
}
