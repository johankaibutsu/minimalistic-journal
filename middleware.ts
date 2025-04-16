// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ROUTES = ["/admin"]; // Add more specific protected routes if needed (e.g., /admin/new, /admin/edit)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth_token")?.value;

  // Check if the route is an admin route (and not the login page)
  const isProtectedAdminRoute =
    ADMIN_ROUTES.some((route) => pathname.startsWith(route)) &&
    pathname !== "/admin/login";

  if (isProtectedAdminRoute) {
    // Check for the simple auth token
    if (authToken !== "logged_in") {
      // Basic check (INSECURE)
      // Redirect to login page if not authenticated
      const loginUrl = new URL("/admin/login", request.url);
      // Optional: Add a redirect query param
      // loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/admin/:path*", // Apply middleware to all routes under /admin
};
