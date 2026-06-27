export const CUSTOMER_ORDER_PROJECTION = `{
  _id,
  _createdAt,
  orderNumber,
  status,
  subtotal,
  shippingCost,
  tax,
  total,
  shippingMethod,
  paymentMethod,
  currency,
  items,
  shippingAddress,
  "userId": user._ref
}`;

export const CUSTOMER_ORDERS_LIST_PROJECTION = `{
  _id,
  _createdAt,
  orderNumber,
  status,
  total,
  currency,
  "itemCount": count(items)
}`;
