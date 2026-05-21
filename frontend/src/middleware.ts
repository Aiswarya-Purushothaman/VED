import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/profile", "/dashboard", "/account"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!request.cookies.get("ved_auth_hint")?.value;
  const role = request.cookies.get("ved_role_hint")?.value ?? "user";
  const isAdmin = role === "admin";

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r);

  // Admin routes: must be logged in AND be admin
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protected user routes: must be logged in
  if (isProtected && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin" : "/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/account/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
