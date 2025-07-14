import { sql } from "../database"
import type { Lesson, Category } from "../database"

export async function getLessons(
  filters: {
    category?: string
    status?: string
    search?: string
    limit?: number
    offset?: number
  } = {},
) {
  const { category, status, search, limit = 50, offset = 0 } = filters

  let whereClause = "WHERE 1=1"
  const params: any[] = []

  if (category) {
    whereClause += ` AND c.slug = $${params.length + 1}`
    params.push(category)
  }

  if (status) {
    whereClause += ` AND l.status = $${params.length + 1}`
    params.push(status)
  }

  if (search) {
    whereClause += ` AND (l.title ILIKE $${params.length + 1} OR l.description ILIKE $${params.length + 1})`
    params.push(`%${search}%`)
  }

  return await sql`
    SELECT 
      l.*,
      c.name as category_name,
      c.color as category_color,
      u.name as author_name
    FROM lessons l
    LEFT JOIN categories c ON l.category_id = c.id
    LEFT JOIN users u ON l.author_id = u.id
    ${sql.unsafe(whereClause)}
    ORDER BY l.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `.apply(null, params)
}

export async function getLessonBySlug(slug: string): Promise<Lesson | null> {
  const [lesson] = await sql`
    SELECT 
      l.*,
      c.name as category_name,
      c.color as category_color,
      u.name as author_name
    FROM lessons l
    LEFT JOIN categories c ON l.category_id = c.id
    LEFT JOIN users u ON l.author_id = u.id
    WHERE l.slug = ${slug}
  `
  return (lesson as Lesson) || null
}

export async function createLesson(lessonData: {
  title: string
  slug: string
  description: string
  content: string
  category_id: number
  type: string
  difficulty: string
  duration: string
  status: string
  author_id: number
  tags: string[]
}) {
  const [lesson] = await sql`
    INSERT INTO lessons (
      title, slug, description, content, category_id, type, 
      difficulty, duration, status, author_id, tags
    )
    VALUES (
      ${lessonData.title}, ${lessonData.slug}, ${lessonData.description},
      ${lessonData.content}, ${lessonData.category_id}, ${lessonData.type},
      ${lessonData.difficulty}, ${lessonData.duration}, ${lessonData.status},
      ${lessonData.author_id}, ${lessonData.tags}
    )
    RETURNING *
  `
  return lesson
}

export async function updateLesson(id: number, updates: Partial<Lesson>) {
  const setClause = Object.keys(updates)
    .filter((key) => key !== "id")
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ")

  const values = Object.keys(updates)
    .filter((key) => key !== "id")
    .map((key) => updates[key as keyof Lesson])

  const [lesson] = await sql`
    UPDATE lessons 
    SET ${sql.unsafe(setClause)}
    WHERE id = ${id}
    RETURNING *
  `.apply(null, [id, ...values])

  return lesson
}

export async function deleteLesson(id: number) {
  await sql`DELETE FROM lessons WHERE id = ${id}`
}

export async function incrementLessonViews(id: number) {
  await sql`
    UPDATE lessons 
    SET view_count = view_count + 1 
    WHERE id = ${id}
  `
}

export async function getCategories(): Promise<Category[]> {
  return await sql`
    SELECT * FROM categories 
    WHERE is_active = true 
    ORDER BY sort_order, name
  `
}

export async function createCategory(categoryData: {
  name: string
  slug: string
  description: string
  color: string
  icon: string
}) {
  const [category] = await sql`
    INSERT INTO categories (name, slug, description, color, icon)
    VALUES (${categoryData.name}, ${categoryData.slug}, ${categoryData.description}, 
            ${categoryData.color}, ${categoryData.icon})
    RETURNING *
  `
  return category
}

export async function getLessonStats() {
  const [stats] = await sql`
    SELECT 
      COUNT(*) as total_lessons,
      COUNT(*) FILTER (WHERE status = 'published') as published_lessons,
      COUNT(*) FILTER (WHERE status = 'draft') as draft_lessons,
      COUNT(*) FILTER (WHERE status = 'review') as review_lessons,
      SUM(view_count) as total_views,
      SUM(completion_count) as total_completions,
      AVG(rating) as average_rating
    FROM lessons
  `
  return stats
}
