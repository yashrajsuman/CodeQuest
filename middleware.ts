import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected and public-only routes
const protectedRoutes = ["/dashboard", "/subjects", "/game", "/progress", "/badges"]
const publicOnlyRoutes = ["/login", "/signup"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublicOnlyRoute = publicOnlyRoutes.some((route) => pathname.startsWith(route))

  // Get user session from cookie (in a real app, you'd validate JWT token)
  const userSession = request.cookies.get("codequest-session")

  // Redirect logic for protected routes
  if (isProtectedRoute && !userSession) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logic for public-only routes (login/signup)
  if (isPublicOnlyRoute && userSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
