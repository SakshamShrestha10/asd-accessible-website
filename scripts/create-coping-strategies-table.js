#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function createCopingStrategiesTable() {
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

    console.log("🌱 Creating coping_strategies table...");

    // Create the table
    await sql`
      CREATE TABLE IF NOT EXISTS coping_strategies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration VARCHAR(100),
        difficulty VARCHAR(50),
        icon VARCHAR(50),
        color VARCHAR(20),
        category VARCHAR(50),
        steps JSONB DEFAULT '[]'::jsonb,
        benefits JSONB DEFAULT '[]'::jsonb,
        audio_url VARCHAR(500),
        audio_duration VARCHAR(50),
        audio_type VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("✅ coping_strategies table created");

    // Insert sample data
    console.log("🌱 Inserting sample data...");
    await sql`
      INSERT INTO coping_strategies (title, description, duration, difficulty, icon, color, category, steps, benefits, sort_order) VALUES
      ('4-7-8 Breathing', 'A simple breathing technique to calm your nervous system quickly', '2-3 minutes', 'Easy', 'Waves', 'blue', 'immediate', '["Breathe in through your nose for 4 counts", "Hold your breath for 7 counts", "Breathe out through your mouth for 8 counts", "Repeat 3-4 times"]', '[]', 1),
      ('5-4-3-2-1 Grounding', 'Use your senses to feel more present and calm', '3-5 minutes', 'Easy', 'Brain', 'green', 'immediate', '["Name 5 things you can see", "Name 4 things you can touch", "Name 3 things you can hear", "Name 2 things you can smell", "Name 1 thing you can taste"]', '[]', 2),
      ('Progressive Muscle Relaxation', 'Tense and relax different muscle groups to release physical stress', '10-15 minutes', 'Medium', 'Heart', 'purple', 'immediate', '["Start with your toes - tense for 5 seconds, then relax", "Move up to your calves, thighs, and so on", "Work through each muscle group", "End with your face and head muscles"]', '[]', 3),
      ('Morning Routine Builder', 'Create a calming start to your day with predictable steps', '15-30 minutes', 'Easy', 'Timer', 'orange', 'daily', '[]', '["Reduces morning anxiety", "Creates predictability", "Builds positive momentum"]', 4),
      ('Sensory Break Kit', 'Tools and techniques for when you feel overwhelmed', '5-10 minutes', 'Easy', 'Palette', 'teal', 'daily', '[]', '["Prevents sensory overload", "Quick reset", "Portable solutions"]', 5),
      ('Energy Management', 'Learn to recognize and respect your energy limits', 'Ongoing', 'Medium', 'Moon', 'indigo', 'daily', '[]', '["Prevents burnout", "Improves self-awareness", "Better planning"]', 6)
    `;

    // Insert audio strategies
    await sql`
      INSERT INTO coping_strategies (title, description, duration, difficulty, icon, color, category, audio_type, sort_order) VALUES
      ('Forest Sounds', 'Gentle rain and bird sounds for relaxation', '30 minutes', 'Easy', 'Volume2', 'green', 'audio', 'Nature', 7),
      ('White Noise', 'Consistent sound to mask distracting noises', '60 minutes', 'Easy', 'Volume2', 'blue', 'audio', 'Focus', 8),
      ('Guided Body Scan', 'Gentle voice guiding you through relaxation', '15 minutes', 'Easy', 'Volume2', 'purple', 'audio', 'Meditation', 9)
    `;

    console.log("✅ Sample data inserted");

    // Verify
    const count = await sql`SELECT COUNT(*) as count FROM coping_strategies`;
    console.log(`📊 Total coping strategies: ${count[0].count}`);

    console.log("🎉 Coping strategies table setup completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createCopingStrategiesTable();
