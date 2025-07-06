import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/database";

export async function GET() {
  try {
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
        is_active
      FROM healthcare_providers 
      WHERE is_active = true AND is_accepting_patients = true
      ORDER BY name ASC
    `;

    return NextResponse.json({
      doctors: result,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
