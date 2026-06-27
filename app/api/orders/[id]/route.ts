import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-server";
import { client } from "@/lib/sanity";
import { CUSTOMER_ORDER_PROJECTION } from "@/lib/orders/queries";

export const runtime = "nodejs";

type OrderRecord = {
  _id: string;
  userId?: string;
};

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await client.fetch<OrderRecord | null>(
      `*[_type == "order" && _id == $id][0] ${CUSTOMER_ORDER_PROJECTION}`,
      { id: params.id }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const safeOrder = { ...order };
    delete safeOrder.userId;
    return NextResponse.json(safeOrder);
  } catch (error) {
    console.error("FETCH_ORDER_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
