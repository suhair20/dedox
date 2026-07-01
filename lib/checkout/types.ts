export type CheckoutItemInput = {
  id: string;
  quantity: number;
};

export type ValidatedCheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand?: string;
  category?: string;
};

export type ShippingAddressInput = {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  postalCode?: string;
  streetAddress: string;
};

export type ShippingMethod = "standard" | "express";

export type PaymentMethod = "card" | "upi" | "paypal" | "cod";

export type CheckoutTotals = {
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
};

export type CheckoutPayload = {
  items: CheckoutItemInput[];
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddressInput;
  currency?: string;
  stripePaymentIntentId?: string;
  saveAddress?: boolean;
  addressLabel?: string;
};

export type CreateOrderResult = {
  orderId: string;
  orderNumber: string;
};
