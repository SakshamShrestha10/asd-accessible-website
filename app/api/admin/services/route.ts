import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/database";

function getFirstRow(result: any) {
  return Array.isArray(result) ? result[0] : result;
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const services =
      await sql`SELECT * FROM community_services ORDER BY sort_order, id`;
    return NextResponse.json({ services });
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
      contact,
      website,
      type,
      eligibility,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      INSERT INTO community_services (name, description, contact, website, type, eligibility, is_active, sort_order)
      VALUES (${name}, ${description}, ${contact}, ${website}, ${type}, ${eligibility}, ${
      is_active ?? true
    }, ${sort_order ?? 0})
      RETURNING *
    `;
    return NextResponse.json({ service: getFirstRow(result) });
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
      contact,
      website,
      type,
      eligibility,
      is_active,
      sort_order,
    } = data;
    const result = await sql`
      UPDATE community_services SET
        name = ${name},
        description = ${description},
        contact = ${contact},
        website = ${website},
        type = ${type},
        eligibility = ${eligibility},
        is_active = ${is_active},
        sort_order = ${sort_order}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json({ service: getFirstRow(result) });
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
    await sql`DELETE FROM community_services WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
