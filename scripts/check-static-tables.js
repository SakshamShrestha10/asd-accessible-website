#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function checkStaticTables() {
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

    // Check all tables
    console.log("🔍 Checking all tables...");
    const allTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    console.log(
      "📊 All tables:",
      allTables.map((t) => t.table_name)
    );

    // Check specific static content tables
    console.log("\n🔍 Checking static content tables...");

    const tablesToCheck = [
      "community_support_groups",
      "community_activities",
      "community_services",
      "coping_strategies",
      "help_faqs",
      "assessment_types",
      "assessment_questions",
      "communication_cards",
      "communication_phrases",
    ];

    for (const tableName of tablesToCheck) {
      try {
        const result = await sql`SELECT COUNT(*) as count FROM ${sql(
          tableName
        )}`;
        console.log(`✅ ${tableName}: ${result[0].count} rows`);
      } catch (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkStaticTables();
