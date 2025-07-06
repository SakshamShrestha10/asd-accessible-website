#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function createServicesTable() {
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

    console.log("🌱 Creating community_services table...");

    // Create the table
    await sql`
      CREATE TABLE IF NOT EXISTS community_services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        contact VARCHAR(100),
        website VARCHAR(255),
        type VARCHAR(100),
        eligibility VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("✅ community_services table created");

    // Insert sample data
    console.log("🌱 Inserting sample data...");
    await sql`
      INSERT INTO community_services (name, description, contact, website, type, eligibility, sort_order) VALUES
      ('Vocational Rehabilitation Services', 'Job training, placement assistance, and workplace accommodations support', '(555) 111-2222', 'www.vocrehab.gov', 'Employment', 'Adults with disabilities', 1),
      ('Accessible Transportation Program', 'Reduced-fare public transit and specialized transportation services', '(555) 333-4444', 'www.accessibletransit.org', 'Transportation', 'Individuals with disabilities', 2),
      ('Independent Living Support', 'Housing assistance, life skills training, and independent living resources', '(555) 555-6666', 'www.independentliving.org', 'Housing', 'Adults seeking independence', 3),
      ('Disability Rights Legal Aid', 'Free legal assistance for disability-related issues and advocacy', '(555) 777-8888', 'www.disabilitylegal.org', 'Legal', 'Individuals with disabilities', 4),
      ('Autism Healthcare Network', 'Directory of autism-informed healthcare providers and specialists', '(555) 999-0000', 'www.autismhealthcare.org', 'Healthcare', 'All ages', 5)
    `;

    console.log("✅ Sample data inserted");

    // Verify
    const count = await sql`SELECT COUNT(*) as count FROM community_services`;
    console.log(`📊 Total services: ${count[0].count}`);

    console.log("🎉 Services table setup completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createServicesTable();
