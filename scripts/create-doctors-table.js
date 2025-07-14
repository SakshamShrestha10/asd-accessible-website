const { sql } = require("./lib/database.js");
require("dotenv").config({ path: ".env.local" });

async function createDoctorsTable() {
  try {
    console.log("🔧 Creating healthcare_providers table...\n");

    // Create the healthcare_providers table
    await sql`
      CREATE TABLE IF NOT EXISTS healthcare_providers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialty VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        bio TEXT,
        experience VARCHAR(100),
        education VARCHAR(255),
        languages TEXT[],
        insurance_accepted TEXT[],
        certifications TEXT[],
        availability JSONB DEFAULT '{}'::jsonb,
        rating DECIMAL(3,2) DEFAULT 0,
        total_appointments INTEGER DEFAULT 0,
        is_accepting_patients BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("✅ healthcare_providers table created successfully!");

    // Create the trigger for updated_at
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    await sql`
      DROP TRIGGER IF EXISTS update_healthcare_providers_updated_at ON healthcare_providers
    `;

    await sql`
      CREATE TRIGGER update_healthcare_providers_updated_at 
      BEFORE UPDATE ON healthcare_providers 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    console.log("✅ Trigger for updated_at created successfully!");

    // Test the table with a sample insert
    console.log("\n🧪 Testing table with sample data...");
    const testResult = await sql`
      INSERT INTO healthcare_providers (name, specialty, bio) 
      VALUES ('Dr. Test Smith', 'Autism Specialist', 'Test doctor for verification') 
      RETURNING id, name, specialty
    `;

    console.log("✅ Test insert successful:", testResult[0]);

    // Clean up test data
    await sql`DELETE FROM healthcare_providers WHERE name = 'Dr. Test Smith'`;
    console.log("🧹 Test data cleaned up");

    console.log("\n🎉 healthcare_providers table is ready to use!");
  } catch (error) {
    console.error("❌ Error creating table:", error.message);
    console.error("Full error:", error);
  }
}

createDoctorsTable();
