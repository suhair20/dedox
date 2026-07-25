import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-server";
import {
  getPointsSummary,
  listRewardProducts,
} from "@/lib/loyalty/service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [summary, rewards] = await Promise.all([
      getPointsSummary(session.user.id),
      listRewardProducts(),
    ]);

    return NextResponse.json({ summary, rewards });
  } catch (error) {
    console.error("FETCH_POINTS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load loyalty points." },
      { status: 500 }
    );
  }
}
