import { maybeSaveCheckoutAddress } from "@/lib/addresses/service";
import { getCurrentSession } from "@/lib/auth-server";
import { getSanityWriteClient } from "@/lib/sanity";
import { calculateCheckoutTotals } from "@/lib/checkout/calculateTotals";
import { validateCartItems } from "@/lib/checkout/validateCart";
import { verifyStripePayment } from "@/lib/checkout/verifyStripePayment";
import {
  isStripePaymentMethod,
} from "@/lib/checkout/paymentMethods";
import { pointsFor } from "@/lib/loyalty/points";
import {
  assertCanRedeem,
  recordRedemption,
  rewardImageUrl,
} from "@/lib/loyalty/service";
import type { RewardProduct } from "@/lib/loyalty/types";
import type {
  CheckoutPayload,
  CreateOrderResult,
  ShippingAddressInput,
  ValidatedCheckoutItem,
} from "@/lib/checkout/types";

type SanityReference = {
  _type: "reference";
  _ref: string;
};

type OrderLineItemDoc = {
  _type: "orderLineItem";
  product: SanityReference;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand?: string;
  category?: string;
};

type RedeemedRewardDoc = {
  productId: string;
  name: string;
  pointsSpent: number;
};

type OrderDocument = {
  _type: "order";
  orderNumber: string;
  status: "pending";
  items: OrderLineItemDoc[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingMethod: CheckoutPayload["shippingMethod"];
  paymentMethod: CheckoutPayload["paymentMethod"];
  shippingAddress: ShippingAddressInput & { _type: "shippingAddress" };
  currency: string;
  user?: SanityReference;
  stripePaymentIntentId?: string;
  pointsEarned: number;
  redeemedReward?: RedeemedRewardDoc;
};

export function generateOrderNumber() {
  return `DX-${Date.now().toString().slice(-8)}`;
}

function assertShippingAddress(address: ShippingAddressInput) {
  if (
    !address?.email ||
    !address.firstName ||
    !address.lastName ||
    !address.country ||
    !address.city ||
    !address.streetAddress
  ) {
    throw new Error("Complete shipping and contact details are required.");
  }
}

export async function prepareCheckout(payload: CheckoutPayload) {
  assertShippingAddress(payload.shippingAddress);

  const items = await validateCartItems(payload.items);
  const totals = calculateCheckoutTotals(items, payload.shippingMethod);

  return { items, totals };
}

function toRewardLineItem(reward: RewardProduct): OrderLineItemDoc {
  return {
    _type: "orderLineItem",
    product: { _type: "reference", _ref: reward._id },
    productId: reward._id,
    name: reward.name,
    price: 0,
    quantity: 1,
    image: rewardImageUrl(reward),
    brand: "Loyalty Reward",
    category: "Reward",
  };
}

export async function createOrderFromCheckout(
  payload: CheckoutPayload,
  options?: { orderNumber?: string }
): Promise<CreateOrderResult> {
  const { items, totals } = await prepareCheckout(payload);

  if (isStripePaymentMethod(payload.paymentMethod)) {
    if (!payload.stripePaymentIntentId) {
      throw new Error("Payment confirmation is required for online payments.");
    }
    await verifyStripePayment(payload.stripePaymentIntentId, totals.total);
  }

  const session = await getCurrentSession();
  const writeClient = getSanityWriteClient();
  const orderNumber = options?.orderNumber ?? generateOrderNumber();
  const pointsEarned = pointsFor(totals.total);

  let reward: RewardProduct | null = null;
  if (payload.redeemRewardProductId) {
    if (!session?.user?.id) {
      throw new Error("Sign in to redeem loyalty points.");
    }
    if (items.length === 0) {
      throw new Error("Add a paid product before redeeming a reward gift.");
    }
    reward = await assertCanRedeem(
      session.user.id,
      payload.redeemRewardProductId
    );
  }

  const lineItems: OrderLineItemDoc[] = items.map(
    (item: ValidatedCheckoutItem) => ({
      _type: "orderLineItem",
      product: { _type: "reference", _ref: item.id },
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      brand: item.brand,
      category: item.category,
    })
  );

  if (reward) {
    lineItems.push(toRewardLineItem(reward));
  }

  const orderDoc: OrderDocument = {
    _type: "order",
    orderNumber,
    status: "pending",
    items: lineItems,
    subtotal: totals.subtotal,
    shippingCost: totals.shippingCost,
    tax: totals.tax,
    total: totals.total,
    shippingMethod: payload.shippingMethod,
    paymentMethod: payload.paymentMethod,
    shippingAddress: {
      _type: "shippingAddress",
      ...payload.shippingAddress,
    },
    currency: payload.currency || "AED",
    pointsEarned,
    ...(reward
      ? {
          redeemedReward: {
            productId: reward._id,
            name: reward.name,
            pointsSpent: reward.pointsCost,
          },
        }
      : {}),
    ...(payload.stripePaymentIntentId
      ? { stripePaymentIntentId: payload.stripePaymentIntentId }
      : {}),
    ...(session?.user?.id
      ? { user: { _type: "reference", _ref: session.user.id } }
      : {}),
  };

  const createdOrder = await writeClient.create(orderDoc);

  if (session?.user?.id && reward) {
    await recordRedemption(session.user.id, {
      points: reward.pointsCost,
      productId: reward._id,
      productName: reward.name,
      orderNumber,
    });
  }

  if (session?.user?.id) {
    await maybeSaveCheckoutAddress(session.user.id, payload.shippingAddress, {
      saveAddress: payload.saveAddress,
      label: payload.addressLabel,
    });
  }

  return {
    orderId: createdOrder._id,
    orderNumber,
  };
}
