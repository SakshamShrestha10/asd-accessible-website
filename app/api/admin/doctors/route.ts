import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/database";

export async function GET() {
  try {
    // Ensure user is admin
    await requireAdmin();

    const result = await sql`
      SELECT 
        id,
        name,
        specialty,
        email,
        phone,
        address,
        bio,
        experience,
        education,
        languages,
        insurance_accepted,
        certifications,
        availability,
        rating,
        total_appointments,
        is_accepting_patients,
        is_active,
        created_at,
        updated_at
      FROM healthcare_providers 
      ORDER BY name ASC
    `;

    return NextResponse.json({
      doctors: result,
      success: true,
    });
  } catch (error: any) {
    console.error("Error fetching doctors:", error);

    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();

    const body = await request.json();
    const {
      name,
      specialty,
      email,
      phone,
      address,
      bio,
      experience,
      education,
      languages,
      insurance_accepted,
      certifications,
      availability,
      is_accepting_patients = true,
    } = body;

    if (!name || !specialty) {
      return NextResponse.json(
        { error: "Name and specialty are required" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO healthcare_providers (
        name,
        specialty,
        email,
        phone,
        address,
        bio,
        experience,
        education,
        languages,
        insurance_accepted,
        certifications,
        availability,
        is_accepting_patients
      ) VALUES (
        ${name},
        ${specialty},
        ${email || null},
        ${phone || null},
        ${address || null},
        ${bio || null},
        ${experience || null},
        ${education || null},
        ${languages && languages.length > 0 ? languages : null},
        ${
          insurance_accepted && insurance_accepted.length > 0
            ? insurance_accepted
            : null
        },
        ${certifications && certifications.length > 0 ? certifications : null},
        ${availability ? JSON.stringify(availability) : null},
        ${is_accepting_patients}
      ) RETURNING *
    `;

    if (result.length === 0) {
      throw new Error("Failed to create doctor");
    }

    return NextResponse.json({
      doctor: result[0],
      message: "Doctor created successfully",
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      { error: "Failed to create doctor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();

    const body = await request.json();
    const {
      id,
      name,
      specialty,
      email,
      phone,
      address,
      bio,
      experience,
      education,
      languages,
      insurance_accepted,
      certifications,
      availability,
      is_accepting_patients,
    } = body;

    if (!id || !name || !specialty) {
      return NextResponse.json(
        { error: "ID, name, and specialty are required" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE healthcare_providers SET
        name = ${name},
        specialty = ${specialty},
        email = ${email || null},
        phone = ${phone || null},
        address = ${address || null},
        bio = ${bio || null},
        experience = ${experience || null},
        education = ${education || null},
        languages = ${languages && languages.length > 0 ? languages : null},
        insurance_accepted = ${
          insurance_accepted && insurance_accepted.length > 0
            ? insurance_accepted
            : null
        },
        certifications = ${
          certifications && certifications.length > 0 ? certifications : null
        },
        availability = ${availability ? JSON.stringify(availability) : null},
        is_accepting_patients = ${is_accepting_patients},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({
      doctor: result[0],
      message: "Doctor updated successfully",
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { error: "Failed to update doctor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM healthcare_providers 
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { error: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}
