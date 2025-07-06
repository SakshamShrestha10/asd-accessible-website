#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

console.log("🔍 Testing environment variables...");
console.log("");

console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL ? "✅ Set" : "❌ Not set"
);
if (process.env.DATABASE_URL) {
  console.log(
    "  URL preview:",
    process.env.DATABASE_URL.substring(0, 50) + "..."
  );
}

console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Not set");
console.log(
  "NEXTAUTH_URL:",
  process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Not set"
);

console.log("");
console.log("📁 Current working directory:", process.cwd());
console.log("📁 Files in current directory:");
const fs = require("fs");
const files = fs.readdirSync(".");
files.forEach((file) => {
  if (file.startsWith(".env")) {
    console.log(`  - ${file} (${fs.statSync(file).size} bytes)`);
  }
});

console.log("");
if (!process.env.DATABASE_URL) {
  console.log("❌ DATABASE_URL is not set!");
  console.log("Make sure your .env.local file contains:");
  console.log(
    "DATABASE_URL=postgres://neondb_owner:npg_u1OAvpX4rEyq@ep-lucky-river-adxes4o7-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
  );
} else {
  console.log("✅ Environment variables look good!");
}
