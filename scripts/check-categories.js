#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function checkCategories() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("🔍 Checking categories table...");
    console.log("");

    // Check table structure
    console.log("📋 Categories table structure:");
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'categories'
      ORDER BY ordinal_position
    `;

    columns.forEach((col) => {
      console.log(
        `  - ${col.column_name}: ${col.data_type} ${
          col.is_nullable === "NO" ? "NOT NULL" : "NULL"
        }`
      );
    });

    console.log("");

    // Check table content
    console.log("📊 Categories table content:");
    const categories = await sql`SELECT * FROM categories ORDER BY id`;

    if (categories.length > 0) {
      categories.forEach((cat) => {
        console.log(
          `  - ID: ${cat.id}, Name: ${cat.name}, Description: ${
            cat.description || "N/A"
          }`
        );
      });
    } else {
      console.log("  No categories found");
    }

    console.log("");
    console.log("✅ Check completed");
  } catch (error) {
    console.error("❌ Check failed:", error.message);
    process.exit(1);
  }
}

checkCategories();
