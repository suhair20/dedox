import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  MAINTENANCE_BYPASS_COOKIE,
  getMaintenanceBypassSecret,
  isMaintenanceModeEnabled,
} from "@/lib/maintenance";

const PUBLIC_PATHS = ["/coming-soon"];

function isStaticOrWebhook(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/stripe/webhook") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg" ||
    pathname === "/apple-icon.svg" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/dedox-perfume-logo") ||
    pathname.startsWith("/images/")
  );
}

export function middleware(request: NextRequest) {
  if (!isMaintenanceModeEnabled()) {
    return NextResponse.next();
  }

  const bypassSecret = getMaintenanceBypassSecret();
  if (!bypassSecret) {
    return NextResponse.next();
  }

  const { pathname, searchParams } = request.nextUrl;

  if (isStaticOrWebhook(pathname)) {
    return NextResponse.next();
  }

  const previewKey = searchParams.get("preview");
  if (previewKey && previewKey === bypassSecret) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("preview");
    const response = NextResponse.redirect(url);
    response.cookies.set(MAINTENANCE_BYPASS_COOKIE, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  }

  const hasBypass =
    request.cookies.get(MAINTENANCE_BYPASS_COOKIE)?.value === "1";

  if (hasBypass || PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Site is in maintenance mode." },
      { status: 503 }
    );
  }

  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
