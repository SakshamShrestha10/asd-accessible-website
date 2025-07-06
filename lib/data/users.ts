import { sql } from "../database"
import type { User } from "../database"

export async function getUsers(limit = 50, offset = 0) {
  return await sql`
    SELECT id, email, name, is_admin, is_active, created_at, last_login
    FROM users
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
}

export async function getUserById(id: number): Promise<User | null> {
  const [user] = await sql`
    SELECT id, email, name, is_admin, is_active, created_at, last_login, profile_data
    FROM users
    WHERE id = ${id}
  `
  return (user as User) || null
}

export async function updateUser(id: number, updates: Partial<User>) {
  const setClause = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ")

  const values = Object.values(updates)

  const [user] = await sql`
    UPDATE users 
    SET ${sql.unsafe(setClause)}
    WHERE id = ${id}
    RETURNING id, email, name, is_admin, is_active, created_at, updated_at
  `.apply(null, [id, ...values])

  return user
}

export async function deleteUser(id: number) {
  await sql`
    UPDATE users 
    SET is_active = false 
    WHERE id = ${id}
  `
}

export async function getUserStats() {
  const [stats] = await sql`
    SELECT 
      COUNT(*) as total_users,
      COUNT(*) FILTER (WHERE is_active = true) as active_users,
      COUNT(*) FILTER (WHERE is_admin = true) as admin_users,
      COUNT(*) FILTER (WHERE last_login > CURRENT_DATE - INTERVAL '30 days') as active_last_30_days
    FROM users
  `
  return stats
}
