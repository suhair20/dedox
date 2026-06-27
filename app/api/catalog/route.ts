import { NextResponse } from "next/server";
import { fetchCatalogSnapshot } from "@/lib/products";

export async function GET() {
  try {
    const catalog = await fetchCatalogSnapshot();
    return NextResponse.json(catalog);
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return NextResponse.json({ error: "Failed to fetch catalog" }, { status: 500 });
  }
}
