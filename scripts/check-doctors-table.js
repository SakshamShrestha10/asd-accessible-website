const { sql } = require("./lib/database.js");
require("dotenv").config({ path: ".env.local" });

async function checkDoctorsTable() {
  try {
    console.log("🔍 Checking healthcare_providers table structure...\n");

    const result = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'healthcare_providers' 
      ORDER BY ordinal_position
    `;

    console.log("📊 Healthcare providers table columns:");
    result.forEach((col) => {
      console.log(
        `  ${col.column_name} (${col.data_type}) - ${
          col.is_nullable === "YES" ? "nullable" : "not null"
        } - default: ${col.column_default || "none"}`
      );
    });

    console.log("\n🔍 Testing a simple insert...");
    const testResult = await sql`
      INSERT INTO healthcare_providers (name, specialty) 
      VALUES ('Test Doctor', 'Test Specialty') 
      RETURNING id, name, specialty
    `;

    console.log("✅ Test insert successful:", testResult[0]);

    // Clean up test data
    await sql`DELETE FROM healthcare_providers WHERE name = 'Test Doctor'`;
    console.log("🧹 Test data cleaned up");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
  }
}

checkDoctorsTable();
