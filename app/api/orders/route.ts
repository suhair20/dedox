import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-server";
import { getSanityWriteClient } from "@/lib/sanity";

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
  category?: string;
};

type ShippingAddressInput = {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  postalCode?: string;
  streetAddress: string;
};

type CheckoutBody = {
  items: CheckoutItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingMethod: "standard" | "express";
  paymentMethod: "card" | "upi" | "paypal" | "cod";
  shippingAddress: ShippingAddressInput;
  currency?: string;
};

function generateOrderNumber() {
  return `DX-${Date.now().toString().slice(-8)}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const {
      items,
      subtotal,
      shippingCost,
      tax,
      total,
      shippingMethod,
      paymentMethod,
      shippingAddress,
      currency = "AED",
    } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (
      !shippingAddress?.email ||
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.country ||
      !shippingAddress.city ||
      !shippingAddress.streetAddress
    ) {
      return NextResponse.json(
        { error: "Complete shipping and contact details are required." },
        { status: 400 }
      );
    }

    const session = await getCurrentSession();
    const writeClient = getSanityWriteClient();

    const orderDoc: Record<string, unknown> = {
      _type: "order",
      orderNumber: generateOrderNumber(),
      status: "pending",
      items: items.map((item) => ({
        _type: "orderLineItem",
        product: { _type: "reference", _ref: item.id },
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        brand: item.brand,
        category: item.category,
      })),
      subtotal,
      shippingCost,
      tax,
      total,
      shippingMethod,
      paymentMethod,
      shippingAddress: {
        _type: "shippingAddress",
        ...shippingAddress,
      },
      currency,
    };

    if (session?.user?.id) {
      orderDoc.user = { _type: "reference", _ref: session.user.id };
    }

    const createdOrder = await writeClient.create(orderDoc);

    return NextResponse.json({
      success: true,
      orderId: createdOrder._id,
      orderNumber: orderDoc.orderNumber,
    });
  } catch (error) {
    console.error("CREATE_ORDER_ERROR:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 }
    );
  }
}
