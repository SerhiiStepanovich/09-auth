import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Регулярні вирази для маршрутів
const PUBLIC_FILE = /\.(.*)$/;
const AUTH_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

// Визначаємо, чи маршрут є приватним
function isPrivateRoute(pathname: string) {
  return PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
}

// Визначаємо, чи маршрут є маршрутом аутентифікації
function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.includes(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ігноруємо публічні файли (стилі, зображення, favicon)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Отримуємо cookie з токеном
  const token = request.cookies.get("token");
  const isAuthenticated = !!token;

  if (isPrivateRoute(pathname) && !isAuthenticated) {
    // 1. Приватний маршрут без токена -> Редірект на логін
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname); // Зберігаємо, куди йшов користувач
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute(pathname) && isAuthenticated) {
    // 2. Маршрут аутентифікації з токеном -> Редірект на профіль
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Додайте всі маршрути, які потрібно перевіряти, включаючи групи маршрутів
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
