import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Admin routes that require authentication
const adminProtectedRoutes = [
  "/admin/dashboard",
  "/admin/projects",
  "/admin/submissions",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is admin protected
  const isAdminRoute = adminProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminRoute) {
    // Check for token in cookies first
    const token =
      request.cookies.get("admin_token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify token using jose (Edge-compatible)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);

      // Token is valid, proceed
      return NextResponse.next();
    } catch (error) {
      console.error("Token verification failed:", error);

      // Clear invalid token
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Use "edge" runtime for all paths except API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
