import { NextResponse } from "next/server"
import { getServerUser } from "@/lib/auth"

export async function GET() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  }

  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401, headers })
    }

    return NextResponse.json(user, { headers })
  } catch (error) {
    console.error("Auth API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  })
}
