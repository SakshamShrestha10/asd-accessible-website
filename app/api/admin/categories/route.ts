import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();

    // Fetch all learning categories
    const categories = await sql`
      SELECT 
        id, 
        name, 
        description, 
        color,
        is_active,
        sort_order
      FROM categories 
      WHERE is_active = true
      ORDER BY sort_order ASC, name ASC
    `;

    return NextResponse.json({
      categories: categories,
      success: true,
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);

    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure user is admin
    const adminUser = await requireAdmin();

    const body = await request.json();
    const { name, description, color } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Get the next sort order
    const maxSortOrder = await sql`
      SELECT COALESCE(MAX(sort_order), 0) as max_order FROM categories
    `;
    const nextSortOrder = (maxSortOrder[0]?.max_order || 0) + 1;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Create new category
    const result = await sql`
      INSERT INTO categories (
        name, 
        description, 
        color,
        sort_order,
        is_active,
        slug
      ) VALUES (
        ${name}, 
        ${description}, 
        ${color || "#3B82F6"},
        ${nextSortOrder},
        true,
        ${slug}
      ) RETURNING id, name, description, color, sort_order, is_active
    `;

    if (!result || result.length === 0) {
      throw new Error("Failed to create category");
    }

    return NextResponse.json({
      category: result[0],
      success: true,
    });
  } catch (error: any) {
    console.error("Error creating category:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });

    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return more specific error messages
    if (error.message?.includes("duplicate key")) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      );
    }

    if (error.message?.includes("violates not-null constraint")) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Failed to create category: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Ensure user is admin
    const adminUser = await requireAdmin();

    const body = await request.json();
    const { id, name, description, color, is_active } = body;

    // Validate required fields
    if (!id || !name || !description) {
      return NextResponse.json(
        { error: "ID, name, and description are required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Update category
    const result = await sql`
      UPDATE categories 
      SET 
        name = ${name},
        description = ${description},
        color = ${color || "#3B82F6"},
        is_active = ${is_active !== undefined ? is_active : true},
        slug = ${slug},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, description, color, sort_order, is_active
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      category: result[0],
      success: true,
    });
  } catch (error: any) {
    console.error("Error updating category:", error);

    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: `Failed to update category: ${error.message}` },
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
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Check if category is being used by any learning paths
    const learningPathsCount = await sql`
      SELECT COUNT(*) as count FROM learning_paths WHERE category_id = ${parseInt(
        id
      )}
    `;

    if (learningPathsCount[0]?.count > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category that has learning paths. Please delete or reassign the learning paths first.",
        },
        { status: 400 }
      );
    }

    // Delete category
    const result = await sql`
      DELETE FROM categories WHERE id = ${parseInt(id)}
    `;

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting category:", error);

    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: `Failed to delete category: ${error.message}` },
      { status: 500 }
    );
  }
}
