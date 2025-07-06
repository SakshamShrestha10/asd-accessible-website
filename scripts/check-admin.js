#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function checkAdmin() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("🔍 Checking admin users...");
    console.log("");

    // Check all admin users
    const adminUsers = await sql`
      SELECT id, email, name, is_admin, is_active, created_at
      FROM users 
      WHERE is_admin = true
      ORDER BY id
    `;

    if (adminUsers.length > 0) {
      console.log("✅ Admin users found:");
      adminUsers.forEach((user) => {
        console.log(`  - ID: ${user.id}`);
        console.log(`    Email: ${user.email}`);
        console.log(`    Name: ${user.name}`);
        console.log(`    Is Admin: ${user.is_admin}`);
        console.log(`    Is Active: ${user.is_active}`);
        console.log(`    Created: ${user.created_at}`);
        console.log("");
      });
    } else {
      console.log("❌ No admin users found!");
      console.log("");

      // Show all users
      console.log("📋 All users in database:");
      const allUsers = await sql`
        SELECT id, email, name, is_admin, is_active, created_at
        FROM users 
        ORDER BY id
      `;

      allUsers.forEach((user) => {
        console.log(
          `  - ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Admin: ${user.is_admin}, Active: ${user.is_active}`
        );
      });
    }

    console.log("");
    console.log("💡 To log in as admin:");
    console.log("1. Go to: http://localhost:3000/auth/login");
    console.log("2. Use one of the admin emails above");
    console.log("3. Password for all demo users is: 'password'");
    console.log("");
  } catch (error) {
    console.error("❌ Check failed:", error.message);
    process.exit(1);
  }
}

checkAdmin();
