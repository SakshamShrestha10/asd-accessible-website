"use server"

import "server-only"
import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Cache the connection on globalThis to avoid recreating it on every import
declare global {
  var __NEON_SQL__: ReturnType<typeof neon> | undefined
}

const sql = globalThis.__NEON_SQL__ ?? neon(process.env.DATABASE_URL)

if (process.env.NODE_ENV !== "production") {
  globalThis.__NEON_SQL__ = sql
}

export { sql }

// Helper types for common database operations
export interface DatabaseError {
  message: string
  code?: string
}

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    return (await sql(query, params)) as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function executeTransaction<T>(queries: Array<{ query: string; params?: any[] }>): Promise<T[]> {
  const results: T[] = []

  for (const { query, params = [] } of queries) {
    const result = await executeQuery<T>(query, params)
    results.push(...result)
  }

  return results
}

// Analytics function for tracking user events
export async function logAnalyticsEvent(
  userId: number | null,
  eventType: string,
  eventData: Record<string, any> = {},
  sessionId?: string,
  ipAddress?: string,
  userAgent?: string,
) {
  try {
    await sql`
      INSERT INTO analytics_events (user_id, event_type, event_data, session_id, ip_address, user_agent, created_at)
      VALUES (${userId}, ${eventType}, ${JSON.stringify(eventData)}, ${sessionId}, ${ipAddress}, ${userAgent}, NOW())
    `
  } catch (error) {
    // Analytics failures should not break the main flow
    console.error("Analytics logging error:", error)
  }
}

// Connection test function
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1 as test`
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}
