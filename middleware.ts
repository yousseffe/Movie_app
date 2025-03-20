import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // If not logged in or not an admin, redirect to login
    if (!token || token.role !== "admin") {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(url)
    }
  }

  // Check if the path is for authenticated users only
  if (
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/watchlist") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/notifications")
  ) {
    // If not logged in, redirect to login
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/watchlist/:path*", "/settings/:path*", "/notifications/:path*"],
}

