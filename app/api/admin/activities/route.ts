import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/database";

function getFirstRow(result: any) {
  return Array.isArray(result) ? result[0] : result;
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const activities =
      await sql`SELECT * FROM community_activities ORDER BY sort_order, id`;
    return NextResponse.json({ activities });
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
      name,
      description,
      location,
      schedule,
      icon,
      color,
      cost,
      age_group,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      INSERT INTO community_activities (name, description, location, schedule, icon, color, cost, age_group, is_active, sort_order)
      VALUES (${name}, ${description}, ${location}, ${schedule}, ${icon}, ${color}, ${cost}, ${age_group}, ${
      is_active ?? true
    }, ${sort_order ?? 0})
      RETURNING *
    `;
    return NextResponse.json({ activity: getFirstRow(result) });
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
      name,
      description,
      location,
      schedule,
      icon,
      color,
      cost,
      age_group,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      UPDATE community_activities SET
        name = ${name},
        description = ${description},
        location = ${location},
        schedule = ${schedule},
        icon = ${icon},
        color = ${color},
        cost = ${cost},
        age_group = ${age_group},
        is_active = ${is_active},
        sort_order = ${sort_order}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json({ activity: getFirstRow(result) });
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
    await sql`DELETE FROM community_activities WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
