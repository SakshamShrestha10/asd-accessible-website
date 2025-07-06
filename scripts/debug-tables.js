#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function debugTables() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("🔍 Debugging database tables...");
    console.log("");

    // Check all tables in public schema
    console.log("📊 All tables in public schema:");
    const allTables = await sql`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    allTables.forEach((table) => {
      console.log(`  - ${table.table_name} (${table.table_type})`);
    });

    console.log("");

    // Check if learning_categories exists specifically
    console.log("🔍 Checking for learning_categories table:");
    const categoriesTable = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'learning_categories'
    `;

    if (categoriesTable.length > 0) {
      console.log("✅ learning_categories table exists");

      // Show table structure
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'learning_categories'
        ORDER BY ordinal_position
      `;

      console.log("📋 Table structure:");
      columns.forEach((col) => {
        console.log(
          `  - ${col.column_name}: ${col.data_type} ${
            col.is_nullable === "NO" ? "NOT NULL" : "NULL"
          }`
        );
      });
    } else {
      console.log("❌ learning_categories table does NOT exist");
    }

    console.log("");

    // Check for any foreign key constraints that might be broken
    console.log("🔗 Checking foreign key constraints:");
    const foreignKeys = await sql`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name
    `;

    if (foreignKeys.length > 0) {
      console.log("Foreign key constraints found:");
      foreignKeys.forEach((fk) => {
        console.log(
          `  - ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`
        );
      });
    } else {
      console.log("No foreign key constraints found");
    }

    console.log("");
    console.log("✅ Debug completed");
  } catch (error) {
    console.error("❌ Debug failed:", error.message);
    process.exit(1);
  }
}

debugTables();
