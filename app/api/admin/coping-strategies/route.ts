import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/database";

function getFirstRow(result: any) {
  return Array.isArray(result) ? result[0] : result;
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const copingStrategies =
      await sql`SELECT * FROM coping_strategies ORDER BY sort_order, id`;
    return NextResponse.json({ copingStrategies });
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
      duration,
      difficulty,
      icon,
      color,
      category,
      steps,
      benefits,
      audio_url,
      audio_duration,
      audio_type,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      INSERT INTO coping_strategies (title, description, duration, difficulty, icon, color, category, steps, benefits, audio_url, audio_duration, audio_type, is_active, sort_order)
      VALUES (${title}, ${description}, ${duration}, ${difficulty}, ${icon}, ${color}, ${category}, ${JSON.stringify(
      steps || []
    )}, ${JSON.stringify(
      benefits || []
    )}, ${audio_url}, ${audio_duration}, ${audio_type}, ${is_active ?? true}, ${
      sort_order ?? 0
    })
      RETURNING *
    `;
    return NextResponse.json({ copingStrategy: getFirstRow(result) });
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
      duration,
      difficulty,
      icon,
      color,
      category,
      steps,
      benefits,
      audio_url,
      audio_duration,
      audio_type,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      UPDATE coping_strategies SET
        title = ${title},
        description = ${description},
        duration = ${duration},
        difficulty = ${difficulty},
        icon = ${icon},
        color = ${color},
        category = ${category},
        steps = ${JSON.stringify(steps || [])},
        benefits = ${JSON.stringify(benefits || [])},
        audio_url = ${audio_url},
        audio_duration = ${audio_duration},
        audio_type = ${audio_type},
        is_active = ${is_active},
        sort_order = ${sort_order}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json({ copingStrategy: getFirstRow(result) });
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
    await sql`DELETE FROM coping_strategies WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
