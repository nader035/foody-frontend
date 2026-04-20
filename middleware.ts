import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getRequiredRole,
  isGuestOnlyRoute,
  roleHome,
} from "@/lib/route-access";

type UserRole = "customer" | "manager" | "staff" | "charity";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("foody_token")?.value;
  const role = request.cookies.get("foody_role")?.value as UserRole | undefined;
  const requiredRole = getRequiredRole(pathname);

  if (requiredRole) {
    if (!token) {
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(authUrl);
    }

    if (role && role !== requiredRole) {
      return NextResponse.redirect(new URL(roleHome[role], request.url));
    }
  }

  if (isGuestOnlyRoute(pathname) && token && role) {
    return NextResponse.redirect(new URL(roleHome[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
