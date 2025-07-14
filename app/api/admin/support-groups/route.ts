import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/database";

function getFirstRow(result: any) {
  return Array.isArray(result) ? result[0] : result;
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const supportGroups =
      await sql`SELECT * FROM community_support_groups ORDER BY sort_order, id`;
    return NextResponse.json({ supportGroups });
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
      address,
      schedule,
      contact,
      website,
      type,
      capacity,
      facilitator,
      cost,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      INSERT INTO community_support_groups (name, description, location, address, schedule, contact, website, type, capacity, facilitator, cost, is_active, sort_order)
      VALUES (${name}, ${description}, ${location}, ${address}, ${schedule}, ${contact}, ${website}, ${type}, ${capacity}, ${facilitator}, ${cost}, ${
      is_active ?? true
    }, ${sort_order ?? 0})
      RETURNING *
    `;
    return NextResponse.json({ supportGroup: getFirstRow(result) });
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
      address,
      schedule,
      contact,
      website,
      type,
      capacity,
      facilitator,
      cost,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      UPDATE community_support_groups SET
        name = ${name},
        description = ${description},
        location = ${location},
        address = ${address},
        schedule = ${schedule},
        contact = ${contact},
        website = ${website},
        type = ${type},
        capacity = ${capacity},
        facilitator = ${facilitator},
        cost = ${cost},
        is_active = ${is_active},
        sort_order = ${sort_order}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json({ supportGroup: getFirstRow(result) });
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
    await sql`DELETE FROM community_support_groups WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
