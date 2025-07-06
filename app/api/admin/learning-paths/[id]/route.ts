import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/database";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure user is admin
    await requireAdmin();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { is_published } = body;

    // Update learning path
    const result = await sql`
      UPDATE learning_paths 
      SET is_published = ${is_published}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Learning path not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      learningPath: result[0],
      success: true,
    });
  } catch (error: any) {
    console.error("Error updating learning path:", error);

    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update learning path" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure user is admin
    await requireAdmin();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Delete learning path
    const result = await sql`
      DELETE FROM learning_paths 
      WHERE id = ${id}
      RETURNING id
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Learning path not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Learning path deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting learning path:", error);

    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to delete learning path" },
      { status: 500 }
    );
  }
}
