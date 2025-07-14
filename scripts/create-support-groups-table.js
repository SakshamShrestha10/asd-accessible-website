#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function createSupportGroupsTable() {
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

    console.log("🌱 Creating community_support_groups table...");

    // Create the table
    await sql`
      CREATE TABLE IF NOT EXISTS community_support_groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        address TEXT,
        schedule TEXT,
        contact VARCHAR(100),
        website VARCHAR(255),
        type VARCHAR(100),
        capacity VARCHAR(100),
        facilitator VARCHAR(255),
        cost VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("✅ community_support_groups table created");

    // Insert sample data
    console.log("🌱 Inserting sample data...");
    await sql`
      INSERT INTO community_support_groups (name, description, location, address, schedule, contact, website, type, capacity, facilitator, cost, sort_order) VALUES
      ('Adults with Autism Support Group', 'A safe space for adults on the autism spectrum to share experiences and support each other', 'Downtown Community Center', '123 Main St, Downtown', 'Every Tuesday, 7:00 PM - 8:30 PM', '(555) 123-4567', 'www.adultsautismsupport.org', 'Support Group', '12-15 people', 'Licensed Social Worker', 'Free', 1),
      ('Families & Caregivers Circle', 'Support and resources for families and caregivers of individuals with autism', 'Westside Family Center', '456 Oak Ave, Westside', 'First Saturday of each month, 10:00 AM - 12:00 PM', '(555) 234-5678', 'www.familycaregivers.org', 'Family Support', '20-25 people', 'Parent Advocate', 'Free', 2),
      ('Young Adults Transition Group', 'For young adults (18-25) navigating independence, work, and relationships', 'Youth Services Building', '789 Pine St, Midtown', 'Every Thursday, 6:00 PM - 7:30 PM', '(555) 345-6789', 'www.youngadultstransition.org', 'Transition Support', '8-10 people', 'Transition Specialist', 'Free', 3)
    `;

    console.log("✅ Sample data inserted");

    // Verify
    const count =
      await sql`SELECT COUNT(*) as count FROM community_support_groups`;
    console.log(`📊 Total support groups: ${count[0].count}`);

    console.log("🎉 Support groups table setup completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createSupportGroupsTable();
