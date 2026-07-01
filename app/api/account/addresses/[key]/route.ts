import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-server";
import {
  deleteSavedAddress,
  setDefaultSavedAddress,
  upsertSavedAddress,
} from "@/lib/addresses/service";
import { validateAddressInput } from "@/lib/addresses/validation";
import type { SavedAddressInput } from "@/lib/addresses/types";

export const runtime = "nodejs";

type RouteContext = { params: { key: string } };

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    action?: "setDefault";
    address?: SavedAddressInput;
  };

  if (body.action === "setDefault") {
    const addresses = await setDefaultSavedAddress(
      session.user.id,
      params.key
    );
    return NextResponse.json(addresses);
  }

  if (body.address && validateAddressInput(body.address)) {
    const addresses = await upsertSavedAddress(
      session.user.id,
      body.address,
      params.key
    );
    return NextResponse.json(addresses);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await deleteSavedAddress(session.user.id, params.key);
  return NextResponse.json(addresses);
}
