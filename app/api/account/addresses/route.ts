import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-server";
import { listSavedAddresses, upsertSavedAddress } from "@/lib/addresses/service";
import { validateAddressInput } from "@/lib/addresses/validation";
import type { SavedAddressInput } from "@/lib/addresses/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await listSavedAddresses(session.user.id);
    return NextResponse.json(addresses);
  } catch (error) {
    console.error("FETCH_ADDRESSES_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load addresses." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SavedAddressInput;
  if (!validateAddressInput(body)) {
    return NextResponse.json(
      { error: "Complete address details are required." },
      { status: 400 }
    );
  }

  const addresses = await upsertSavedAddress(session.user.id, body);
  return NextResponse.json(addresses);
}
