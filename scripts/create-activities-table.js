#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function createActivitiesTable() {
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

    console.log("🌱 Creating community_activities table...");

    // Create the table
    await sql`
      CREATE TABLE IF NOT EXISTS community_activities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        schedule TEXT,
        icon VARCHAR(50),
        color VARCHAR(20),
        cost VARCHAR(100),
        age_group VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("✅ community_activities table created");

    // Insert sample data
    console.log("🌱 Inserting sample data...");
    await sql`
      INSERT INTO community_activities (name, description, location, schedule, icon, color, cost, age_group, sort_order) VALUES
      ('Creative Art Therapy', 'Express yourself through various art mediums in a supportive environment', 'Arts & Wellness Center', 'Wednesdays, 2:00 PM - 4:00 PM', 'Palette', 'purple', '$15 per session', 'All ages', 1),
      ('Social Skills Practice Group', 'Practice conversation and social interaction in a comfortable setting', 'Community Learning Center', 'Saturdays, 11:00 AM - 12:30 PM', 'Users', 'blue', 'Free', 'Adults', 2),
      ('Board Game Night', 'Enjoy board games and card games with others who share your interests', 'Public Library - Community Room', 'Every other Friday, 7:00 PM - 9:00 PM', 'Gamepad2', 'green', 'Free', 'Teens & Adults', 3),
      ('Music Appreciation Circle', 'Listen to and discuss music, share favorite songs, and explore different genres', 'Music Therapy Center', 'Mondays, 4:00 PM - 5:30 PM', 'Music', 'orange', '$10 per session', 'All ages', 4),
      ('Neurodivergent Book Club', 'Read and discuss books with themes relevant to the autism community', 'Central Library', 'Last Sunday of each month, 2:00 PM - 4:00 PM', 'BookOpen', 'indigo', 'Free', 'Adults', 5),
      ('Coffee & Conversation', 'Casual meetup for coffee and friendly conversation in a quiet environment', 'Quiet Corner Café', 'Sundays, 10:00 AM - 12:00 PM', 'Coffee', 'teal', 'Cost of your order', 'Adults', 6)
    `;

    console.log("✅ Sample data inserted");

    // Verify
    const count = await sql`SELECT COUNT(*) as count FROM community_activities`;
    console.log(`📊 Total activities: ${count[0].count}`);

    console.log("🎉 Activities table setup completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createActivitiesTable();
