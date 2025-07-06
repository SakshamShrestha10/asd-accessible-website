import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionUser } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create response with CORS headers
  const response = NextResponse.next()
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Allow-Credentials", "true")

  // Handle OPTIONS requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers })
  }

  // Check if this is an admin route
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get("support_space_session")?.value

    if (!sessionToken) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const user = await getSessionUser(sessionToken)

      if (!user) {
        const loginUrl = new URL("/auth/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      if (!user.isAdmin) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    } catch (error) {
      console.error("Middleware auth error:", error)
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
