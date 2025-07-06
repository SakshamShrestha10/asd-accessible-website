import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/database";

function getFirstRow(result: any) {
  return Array.isArray(result) ? result[0] : result;
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const communicationTools =
      await sql`SELECT * FROM communication_tools ORDER BY sort_order, id`;
    return NextResponse.json({ communicationTools });
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
      content,
      image_url,
      audio_url,
      tags,
      difficulty,
      icon,
      color,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      INSERT INTO communication_tools (title, description, type, category, content, image_url, audio_url, tags, difficulty, icon, color, is_active, sort_order)
      VALUES (${title}, ${description}, ${type}, ${category}, ${content}, ${image_url}, ${audio_url}, ${JSON.stringify(
      tags || []
    )}, ${difficulty}, ${icon}, ${color}, ${is_active ?? true}, ${
      sort_order ?? 0
    })
      RETURNING *
    `;
    return NextResponse.json({ communicationTool: getFirstRow(result) });
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
      content,
      image_url,
      audio_url,
      tags,
      difficulty,
      icon,
      color,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      UPDATE communication_tools SET
        title = ${title},
        description = ${description},
        type = ${type},
        category = ${category},
        content = ${content},
        image_url = ${image_url},
        audio_url = ${audio_url},
        tags = ${JSON.stringify(tags || [])},
        difficulty = ${difficulty},
        icon = ${icon},
        color = ${color},
        is_active = ${is_active},
        sort_order = ${sort_order}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json({ communicationTool: getFirstRow(result) });
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
    await sql`DELETE FROM communication_tools WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
