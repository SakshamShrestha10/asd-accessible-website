#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function testDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    console.log("Please set your DATABASE_URL environment variable");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("🔌 Testing database connection...");
    await sql`SELECT 1 as test`;
    console.log("✅ Database connection successful");

    console.log("\n📊 Checking tables...");

    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'categories', 'learning_paths')
      ORDER BY table_name
    `;

    console.log(
      "Found tables:",
      tables.map((t) => t.table_name)
    );

    // Check users
    console.log("\n👥 Checking users...");
    const users = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`Users count: ${users[0]?.count || 0}`);

    // Check categories
    console.log("\n📁 Checking categories...");
    const categories = await sql`SELECT COUNT(*) as count FROM categories`;
    console.log(`Categories count: ${categories[0]?.count || 0}`);

    if (categories[0]?.count > 0) {
      const categoryList =
        await sql`SELECT id, name, description FROM categories ORDER BY id`;
      console.log("Categories:", categoryList);
    }

    // Check learning paths
    console.log("\n📚 Checking learning paths...");
    const paths = await sql`SELECT COUNT(*) as count FROM learning_paths`;
    console.log(`Learning paths count: ${paths[0]?.count || 0}`);

    if (paths[0]?.count > 0) {
      const pathsList = await sql`
        SELECT lp.id, lp.title, lp.category_id, lc.name as category_name 
        FROM learning_paths lp 
        LEFT JOIN categories lc ON lp.category_id = lc.id 
        ORDER BY lp.id
      `;
      console.log("Learning paths with categories:", pathsList);
    }

    console.log("\n✅ Database test completed successfully!");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    process.exit(1);
  }
}

testDatabase();
