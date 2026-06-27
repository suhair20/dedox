export type OrderLineItem = {
  _key?: string;
  name?: string;
  quantity?: number;
  price?: number;
  image?: string;
  brand?: string;
  category?: string;
  productId?: string;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type CustomerOrder = {
  _id: string;
  _createdAt: string;
  orderNumber?: string;
  status: OrderStatus | string;
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
  total: number;
  shippingMethod?: string;
  paymentMethod?: string;
  currency?: string;
  items?: OrderLineItem[];
  shippingAddress?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    streetAddress?: string;
  };
};
