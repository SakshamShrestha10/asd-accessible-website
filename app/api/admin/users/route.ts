import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();

    // Fetch all users
    const users = await sql`
      SELECT 
        id, 
        name, 
        email, 
        is_admin, 
        is_active, 
        created_at, 
        last_login
      FROM users 
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      users: users,
      success: true,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);

    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
