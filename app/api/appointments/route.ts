import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/database";

export async function GET() {
  try {
    // Ensure user is authenticated
    const user = await requireAuth();

    // Fetch user's appointments
    const appointments = await sql`
      SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.duration,
        a.appointment_type,
        a.status,
        a.notes,
        a.patient_notes,
        a.created_at,
        hp.name as provider_name,
        hp.specialty as provider_specialty,
        hp.address as provider_address
      FROM appointments a
      LEFT JOIN healthcare_providers hp ON a.provider_id = hp.id
      WHERE a.user_id = ${user.id}
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `;

    return NextResponse.json({
      appointments: appointments,
      success: true,
    });
  } catch (error: any) {
    console.error("Error fetching appointments:", error);

    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure user is authenticated
    const user = await requireAuth();

    const body = await request.json();
    const {
      provider_id,
      appointment_date,
      appointment_type,
      duration = 60,
      notes,
      patient_notes,
    } = body;

    if (!provider_id || !appointment_date || !appointment_type) {
      return NextResponse.json(
        { error: "Provider, date, and appointment type are required" },
        { status: 400 }
      );
    }

    // Parse date and time from appointment_date (ISO string)
    const dateObj = new Date(appointment_date);
    const datePart = dateObj.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    const timePart = dateObj.toISOString().split("T")[1].slice(0, 8); // 'HH:MM:SS'

    // Check if provider exists and is accepting patients
    const providerCheck = await sql`
      SELECT id, name, is_accepting_patients, is_active 
      FROM healthcare_providers 
      WHERE id = ${provider_id}
    `;

    if (providerCheck.length === 0) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    if (
      !providerCheck[0].is_accepting_patients ||
      !providerCheck[0].is_active
    ) {
      return NextResponse.json(
        { error: "Provider is not currently accepting appointments" },
        { status: 400 }
      );
    }

    // Create the appointment
    const result = await sql`
      INSERT INTO appointments (
        user_id,
        provider_id,
        appointment_date,
        appointment_time,
        duration,
        appointment_type,
        status,
        notes,
        patient_notes
      ) VALUES (
        ${user.id},
        ${provider_id},
        ${datePart},
        ${timePart},
        ${duration},
        ${appointment_type},
        'scheduled',
        ${notes || null},
        ${patient_notes || null}
      ) RETURNING *
    `;

    if (result.length === 0) {
      throw new Error("Failed to create appointment");
    }

    return NextResponse.json({
      appointment: result[0],
      message: "Appointment scheduled successfully",
    });
  } catch (error: any) {
    console.error("Error creating appointment:", error);

    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
