import { sql } from "../database"
import type { HealthcareProvider, Appointment } from "../database"

export async function getHealthcareProviders(
  filters: {
    specialty?: string
    status?: string
    search?: string
    limit?: number
    offset?: number
  } = {},
) {
  const { specialty, status, search, limit = 50, offset = 0 } = filters

  let whereClause = "WHERE 1=1"
  const params: any[] = []

  if (specialty) {
    whereClause += ` AND specialty = $${params.length + 1}`
    params.push(specialty)
  }

  if (status) {
    whereClause += ` AND status = $${params.length + 1}`
    params.push(status)
  }

  if (search) {
    whereClause += ` AND (name ILIKE $${params.length + 1} OR specialty ILIKE $${params.length + 1} OR location ILIKE $${params.length + 1})`
    params.push(`%${search}%`)
  }

  return await sql`
    SELECT * FROM healthcare_providers
    ${sql.unsafe(whereClause)}
    ORDER BY name
    LIMIT ${limit} OFFSET ${offset}
  `.apply(null, params)
}

export async function getProviderById(id: number): Promise<HealthcareProvider | null> {
  const [provider] = await sql`
    SELECT * FROM healthcare_providers WHERE id = ${id}
  `
  return (provider as HealthcareProvider) || null
}

export async function createProvider(providerData: Omit<HealthcareProvider, "id" | "created_at" | "updated_at">) {
  const [provider] = await sql`
    INSERT INTO healthcare_providers (
      name, email, phone, specialty, location, address, bio, experience,
      education, languages, insurance_accepted, certifications, availability, status
    )
    VALUES (
      ${providerData.name}, ${providerData.email}, ${providerData.phone},
      ${providerData.specialty}, ${providerData.location}, ${providerData.address},
      ${providerData.bio}, ${providerData.experience}, ${providerData.education},
      ${providerData.languages}, ${providerData.insurance_accepted}, 
      ${providerData.certifications}, ${JSON.stringify(providerData.availability)}, 
      ${providerData.status}
    )
    RETURNING *
  `
  return provider
}

export async function updateProvider(id: number, updates: Partial<HealthcareProvider>) {
  const setClause = Object.keys(updates)
    .filter((key) => key !== "id")
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ")

  const values = Object.keys(updates)
    .filter((key) => key !== "id")
    .map((key) => updates[key as keyof HealthcareProvider])

  const [provider] = await sql`
    UPDATE healthcare_providers 
    SET ${sql.unsafe(setClause)}
    WHERE id = ${id}
    RETURNING *
  `.apply(null, [id, ...values])

  return provider
}

export async function deleteProvider(id: number) {
  await sql`
    UPDATE healthcare_providers 
    SET status = 'inactive' 
    WHERE id = ${id}
  `
}

export async function getAppointments(
  filters: {
    userId?: number
    providerId?: number
    status?: string
    date?: string
    limit?: number
    offset?: number
  } = {},
) {
  const { userId, providerId, status, date, limit = 50, offset = 0 } = filters

  let whereClause = "WHERE 1=1"
  const params: any[] = []

  if (userId) {
    whereClause += ` AND a.user_id = $${params.length + 1}`
    params.push(userId)
  }

  if (providerId) {
    whereClause += ` AND a.provider_id = $${params.length + 1}`
    params.push(providerId)
  }

  if (status) {
    whereClause += ` AND a.status = $${params.length + 1}`
    params.push(status)
  }

  if (date) {
    whereClause += ` AND a.appointment_date = $${params.length + 1}`
    params.push(date)
  }

  return await sql`
    SELECT 
      a.*,
      u.name as patient_name,
      u.email as patient_email,
      p.name as provider_name,
      p.specialty as provider_specialty
    FROM appointments a
    JOIN users u ON a.user_id = u.id
    JOIN healthcare_providers p ON a.provider_id = p.id
    ${sql.unsafe(whereClause)}
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
    LIMIT ${limit} OFFSET ${offset}
  `.apply(null, params)
}

export async function createAppointment(appointmentData: {
  user_id: number
  provider_id: number
  appointment_date: string
  appointment_time: string
  duration: number
  type: string
  notes?: string
  patient_notes?: string
}) {
  const [appointment] = await sql`
    INSERT INTO appointments (
      user_id, provider_id, appointment_date, appointment_time,
      duration, type, notes, patient_notes
    )
    VALUES (
      ${appointmentData.user_id}, ${appointmentData.provider_id},
      ${appointmentData.appointment_date}, ${appointmentData.appointment_time},
      ${appointmentData.duration}, ${appointmentData.type},
      ${appointmentData.notes || ""}, ${appointmentData.patient_notes || ""}
    )
    RETURNING *
  `
  return appointment
}

export async function updateAppointment(id: number, updates: Partial<Appointment>) {
  const setClause = Object.keys(updates)
    .filter((key) => key !== "id")
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ")

  const values = Object.keys(updates)
    .filter((key) => key !== "id")
    .map((key) => updates[key as keyof Appointment])

  const [appointment] = await sql`
    UPDATE appointments 
    SET ${sql.unsafe(setClause)}
    WHERE id = ${id}
    RETURNING *
  `.apply(null, [id, ...values])

  return appointment
}

export async function getProviderStats() {
  const [stats] = await sql`
    SELECT 
      COUNT(*) as total_providers,
      COUNT(*) FILTER (WHERE status = 'active') as active_providers,
      COUNT(DISTINCT specialty) as specialties_count,
      AVG(rating) as average_rating
    FROM healthcare_providers
  `
  return stats
}

export async function getAppointmentStats() {
  const [stats] = await sql`
    SELECT 
      COUNT(*) as total_appointments,
      COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_appointments,
      COUNT(*) FILTER (WHERE status = 'pending') as pending_appointments,
      COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE) as todays_appointments
    FROM appointments
  `
  return stats
}
