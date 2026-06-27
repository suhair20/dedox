import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-server";
import { createOrderFromCheckout } from "@/lib/checkout/createOrder";
import type { CheckoutPayload } from "@/lib/checkout/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Please log in to place an order." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CheckoutPayload;
    const result = await createOrderFromCheckout(body);

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
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
