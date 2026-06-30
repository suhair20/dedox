import { NextResponse } from "next/server";
import { fetchFeaturedAttributes } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const featured = await fetchFeaturedAttributes();
    return NextResponse.json(featured);
  } catch (error) {
    console.error("Error fetching featured catalog:", error);
    return NextResponse.json({ error: "Failed to fetch featured catalog" }, { status: 500 });
  }
}
