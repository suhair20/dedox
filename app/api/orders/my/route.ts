import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-server";
import { client } from "@/lib/sanity";
import { CUSTOMER_ORDERS_LIST_PROJECTION } from "@/lib/orders/queries";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await client.fetch(
      `*[_type == "order" && user._ref == $userId] | order(_createdAt desc) ${CUSTOMER_ORDERS_LIST_PROJECTION}`,
      { userId: session.user.id }
    );

    return NextResponse.json(Array.isArray(orders) ? orders : []);
  } catch (error) {
    console.error("FETCH_MY_ORDERS_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
