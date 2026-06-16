import { NextResponse } from "next/server";
import { fetchCatalogOptions } from "@/lib/products";

export async function GET() {
  try {
    const catalog = await fetchCatalogOptions();
    return NextResponse.json(catalog);
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return NextResponse.json({ error: "Failed to fetch catalog" }, { status: 500 });
  }
}
