#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

async function applyStaticSchema() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("🔌 Testing database connection...");
    await sql`SELECT 1 as test`;
    console.log("✅ Database connection successful");

    console.log("📖 Reading static content schema...");
    const schemaPath = path.join(__dirname, "003-static-content-schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("🌱 Applying static content schema...");
    await sql.unsafe(schema);
    console.log("✅ Static content schema applied successfully");

    console.log("🌱 Reading static content seed data...");
    const seedPath = path.join(__dirname, "004-static-content-seed.sql");
    const seedData = fs.readFileSync(seedPath, "utf8");

    console.log("🌱 Applying static content seed data...");
    await sql.unsafe(seedData);
    console.log("✅ Static content seed data applied successfully");

    // Verify tables were created
    console.log("🔍 Verifying tables...");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'community_%' 
      OR table_name LIKE 'coping_%' 
      OR table_name LIKE 'help_%' 
      OR table_name LIKE 'assessment_%' 
      OR table_name LIKE 'communication_%'
      ORDER BY table_name
    `;

    console.log(
      "📊 Created tables:",
      tables.map((t) => t.table_name)
    );

    console.log("🎉 Static content schema setup completed successfully!");
  } catch (error) {
    console.error("❌ Static content schema setup failed:", error.message);
    process.exit(1);
  }
}

applyStaticSchema();
