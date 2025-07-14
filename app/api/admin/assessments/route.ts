import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/database";

function getFirstRow(result: any) {
  return Array.isArray(result) ? result[0] : result;
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const assessments =
      await sql`SELECT * FROM assessments ORDER BY sort_order, id`;
    return NextResponse.json({ assessments });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = await req.json();
    const {
      title,
      description,
      type,
      category,
      questions,
      instructions,
      duration,
      difficulty,
      icon,
      color,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      INSERT INTO assessments (title, description, type, category, questions, instructions, duration, difficulty, icon, color, is_active, sort_order)
      VALUES (${title}, ${description}, ${type}, ${category}, ${JSON.stringify(
      questions || []
    )}, ${instructions}, ${duration}, ${difficulty}, ${icon}, ${color}, ${
      is_active ?? true
    }, ${sort_order ?? 0})
      RETURNING *
    `;
    return NextResponse.json({ assessment: getFirstRow(result) });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const data = await req.json();
    const {
      id,
      title,
      description,
      type,
      category,
      questions,
      instructions,
      duration,
      difficulty,
      icon,
      color,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      UPDATE assessments SET
        title = ${title},
        description = ${description},
        type = ${type},
        category = ${category},
        questions = ${JSON.stringify(questions || [])},
        instructions = ${instructions},
        duration = ${duration},
        difficulty = ${difficulty},
        icon = ${icon},
        color = ${color},
        is_active = ${is_active},
        sort_order = ${sort_order}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json({ assessment: getFirstRow(result) });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await req.json();
    await sql`DELETE FROM assessments WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
