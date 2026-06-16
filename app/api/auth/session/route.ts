import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { getCurrentSession } from "@/lib/auth-server";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    const response = NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
  });
}
