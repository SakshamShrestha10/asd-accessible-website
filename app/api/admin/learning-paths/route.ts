import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();

    // Fetch all learning paths with category information
    const learningPaths = await sql`
      SELECT 
        lp.id, 
        lp.title, 
        lp.description, 
        lp.difficulty, 
        lp.content_type, 
        lp.is_published, 
        lp.category_id,
        lp.estimated_duration,
        lp.created_at,
        lc.name as category_name
      FROM learning_paths lp
      LEFT JOIN categories lc ON lp.category_id = lc.id
      ORDER BY lp.created_at DESC
    `;

    return NextResponse.json({
      learningPaths: learningPaths,
      success: true,
    });
  } catch (error: any) {
    console.error("Error fetching learning paths:", error);

    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch learning paths" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure user is admin
    const adminUser = await requireAdmin();

    const body = await request.json();
    const {
      title,
      description,
      difficulty,
      content_type,
      category_id,
      estimated_duration,
    } = body;

    // Validate required fields
    if (!title || !description || !category_id) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    // Create new learning path
    const result = await sql`
      INSERT INTO learning_paths (
        title, 
        description, 
        difficulty, 
        content_type, 
        category_id, 
        estimated_duration,
        created_by
      ) VALUES (
        ${title}, 
        ${description}, 
        ${difficulty || "Beginner"}, 
        ${content_type || "article"}, 
        ${category_id}, 
        ${estimated_duration || null},
        ${adminUser.id}
      ) RETURNING *
    `;

    if (result.length === 0) {
      throw new Error("Failed to create learning path");
    }

    return NextResponse.json({
      learningPath: result[0],
      success: true,
    });
  } catch (error: any) {
    console.error("Error creating learning path:", error);

    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to create learning path" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Ensure user is admin
    const adminUser = await requireAdmin();

    const body = await request.json();
    const {
      id,
      title,
      description,
      difficulty,
      content_type,
      category_id,
      estimated_duration,
      is_published,
    } = body;

    // Validate required fields
    if (!id || !title || !description || !category_id) {
      return NextResponse.json(
        { error: "ID, title, description, and category are required" },
        { status: 400 }
      );
    }

    // Update learning path
    const result = await sql`
      UPDATE learning_paths 
      SET 
        title = ${title},
        description = ${description},
        difficulty = ${difficulty || "Beginner"},
        content_type = ${content_type || "article"},
        category_id = ${category_id},
        estimated_duration = ${estimated_duration || null},
        is_published = ${is_published !== undefined ? is_published : false},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
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
      { error: `Failed to update learning path: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Ensure user is admin
    const adminUser = await requireAdmin();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Learning path ID is required" },
        { status: 400 }
      );
    }

    // Check if learning path has any user progress (only check tables that exist)
    try {
      const progressCount = await sql`
        SELECT COUNT(*) as count FROM user_progress WHERE path_id = ${parseInt(
          id
        )}
      `;

      if (progressCount[0]?.count > 0) {
        return NextResponse.json(
          {
            error:
              "Cannot delete learning path that has user progress. Please delete the progress records first.",
          },
          { status: 400 }
        );
      }
    } catch (tableError: any) {
      // If user_progress table doesn't exist, skip the check
      console.log("user_progress table not found, skipping progress check");
    }

    // Delete learning path
    const result = await sql`
      DELETE FROM learning_paths WHERE id = ${parseInt(id)}
    `;

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
      { error: `Failed to delete learning path: ${error.message}` },
      { status: 500 }
    );
  }
}
