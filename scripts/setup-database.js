#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

async function setupDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    console.log("Please set your DATABASE_URL environment variable");
    console.log(
      'Example: DATABASE_URL="postgresql://username:password@host:port/database"'
    );
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("🔌 Testing database connection...");
    await sql`SELECT 1 as test`;
    console.log("✅ Database connection successful");

    console.log("📖 Reading schema file...");
    const schemaPath = path.join(__dirname, "001-initial-schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("📄 Schema file path:", schemaPath);
    console.log("📄 Schema file size:", schema.length, "characters");
    console.log("📄 First 200 characters of schema:");
    console.log(schema.substring(0, 200));
    console.log(
      "📄 Contains 'learning_categories':",
      schema.includes("learning_categories")
    );
    console.log("📄 Contains 'DROP TABLE':", schema.includes("DROP TABLE"));

    console.log("🌱 Applying database schema...");
    try {
      await sql.unsafe(schema);
      console.log("✅ Database schema applied successfully");
    } catch (error) {
      console.error("❌ Error applying schema:", error.message);
      console.error("❌ Full error:", error);
      throw error;
    }

    console.log("🌱 Reading seed data...");
    const seedPath = path.join(__dirname, "002-seed-data.sql");
    const seedData = fs.readFileSync(seedPath, "utf8");

    console.log("🌱 Applying seed data...");
    await sql.unsafe(seedData);
    console.log("✅ Seed data applied successfully");

    console.log("🌱 Reading static content schema...");
    const staticSchemaPath = path.join(
      __dirname,
      "003-static-content-schema.sql"
    );
    const staticSchema = fs.readFileSync(staticSchemaPath, "utf8");

    console.log("🌱 Applying static content schema...");
    await sql.unsafe(staticSchema);
    console.log("✅ Static content schema applied successfully");

    console.log("🌱 Reading static content seed data...");
    const staticSeedPath = path.join(__dirname, "004-static-content-seed.sql");
    const staticSeedData = fs.readFileSync(staticSeedPath, "utf8");

    console.log("🌱 Applying static content seed data...");
    await sql.unsafe(staticSeedData);
    console.log("✅ Static content seed data applied successfully");

    console.log("🎉 Database setup completed successfully!");
    console.log("");
    console.log("You can now:");
    console.log("1. Start the development server: npm run dev");
    console.log("2. Access the admin panel at: http://localhost:3000/admin");
    console.log("3. Login with: admin@supportspace.org / password");
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  }
}

setupDatabase();
