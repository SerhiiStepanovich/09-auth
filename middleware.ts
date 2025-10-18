import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

import { checkSession } from "./lib/api/serverApi";

const AUTH_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTE_PREFIXES = ["/profile", "/notes"];

function isPrivateRoute(pathname: string) {
  return PRIVATE_ROUTE_PREFIXES.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.includes(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthenticated = !!accessToken;

  if (isPrivateRoute(pathname)) {
    if (isAuthenticated) {
      return NextResponse.next();
    }

    if (refreshToken) {
      try {
        const response = await checkSession();
        const setCookieHeader = response.headers["set-cookie"];

        if (response.status === 200 && setCookieHeader) {
          const nextResponse = NextResponse.next();

          const cookieArray = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          cookieArray.forEach((cookieStr) => {
            nextResponse.headers.append("Set-Cookie", cookieStr);
          });

          return nextResponse;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }

    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
