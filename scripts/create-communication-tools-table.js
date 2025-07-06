#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function createCommunicationToolsTable() {
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

    console.log("🌱 Creating communication_tools table...");

    // Create the table
    await sql`
      CREATE TABLE IF NOT EXISTS communication_tools (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(50),
        content TEXT,
        image_url VARCHAR(500),
        audio_url VARCHAR(500),
        tags JSONB DEFAULT '[]'::jsonb,
        difficulty VARCHAR(50),
        icon VARCHAR(50),
        color VARCHAR(20),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("✅ communication_tools table created");

    // Insert sample data
    console.log("🌱 Inserting sample data...");

    // Communication Cards
    await sql`
      INSERT INTO communication_tools (title, description, type, category, content, tags, difficulty, icon, color, sort_order) VALUES
      ('I Need a Break', 'Simple card to request a break from overwhelming situations', 'card', 'basic_needs', 'I need a break right now. Please give me some space.', '["break", "overwhelmed", "space"]', 'Easy', 'Pause', 'blue', 1),
      ('I''m Hungry', 'Card to communicate hunger and request food', 'card', 'basic_needs', 'I am hungry. Can I have something to eat?', '["hunger", "food", "basic"]', 'Easy', 'Utensils', 'orange', 2),
      ('I''m Tired', 'Card to express fatigue and need for rest', 'card', 'basic_needs', 'I am tired. I need to rest or sleep.', '["tired", "rest", "sleep"]', 'Easy', 'Bed', 'purple', 3),
      ('I Don''t Understand', 'Card to indicate confusion and need for clarification', 'card', 'social', 'I don''t understand. Can you explain that again?', '["confusion", "help", "clarification"]', 'Easy', 'HelpCircle', 'red', 4),
      ('I Need Help', 'General help request card', 'card', 'social', 'I need help with this. Can you assist me?', '["help", "assistance", "support"]', 'Easy', 'HandHeart', 'green', 5)
    `;

    // Phrases
    await sql`
      INSERT INTO communication_tools (title, description, type, category, content, tags, difficulty, icon, color, sort_order) VALUES
      ('Greeting Phrases', 'Common greeting expressions for different situations', 'phrase', 'social', 'Hello, Good morning, Good afternoon, Good evening, Hi there, Nice to meet you', '["greeting", "social", "polite"]', 'Easy', 'MessageSquare', 'blue', 6),
      ('Feeling Expressions', 'Ways to express different emotions and feelings', 'phrase', 'emotions', 'I feel happy, I feel sad, I feel angry, I feel excited, I feel nervous, I feel calm', '["emotions", "feelings", "expression"]', 'Medium', 'Heart', 'pink', 7),
      ('Request Phrases', 'Polite ways to ask for things or help', 'phrase', 'social', 'Could you please help me? May I have that? Would you mind if I...? I would like to...', '["requests", "polite", "help"]', 'Medium', 'Hand', 'green', 8),
      ('Emergency Phrases', 'Important phrases for urgent situations', 'phrase', 'emergency', 'I need help now, This is an emergency, Call 911, I''m not feeling well', '["emergency", "urgent", "help"]', 'Easy', 'AlertTriangle', 'red', 9),
      ('Daily Activities', 'Phrases for common daily activities', 'phrase', 'daily', 'I want to eat, I need to use the bathroom, I want to go outside, I want to play', '["daily", "activities", "routine"]', 'Easy', 'Calendar', 'orange', 10)
    `;

    // Visual Aids
    await sql`
      INSERT INTO communication_tools (title, description, type, category, content, tags, difficulty, icon, color, sort_order) VALUES
      ('Emotion Chart', 'Visual chart showing different emotions with faces', 'visual', 'emotions', 'Chart with happy, sad, angry, excited, calm, nervous faces', '["emotions", "visual", "chart"]', 'Easy', 'Smile', 'yellow', 11),
      ('Schedule Board', 'Visual schedule template for daily activities', 'visual', 'organization', 'Template with time slots and activity cards for daily planning', '["schedule", "planning", "routine"]', 'Medium', 'Calendar', 'blue', 12),
      ('Choice Board', 'Visual board for making choices between options', 'visual', 'decision_making', 'Board with pictures and words for common choices (food, activities, etc.)', '["choices", "decisions", "options"]', 'Easy', 'CheckSquare', 'green', 13),
      ('First-Then Board', 'Visual tool showing sequence of activities', 'visual', 'organization', 'Board showing "First [activity], Then [reward/next activity]"', '["sequence", "motivation", "routine"]', 'Medium', 'ArrowRight', 'purple', 14),
      ('Social Story Template', 'Template for creating personalized social stories', 'visual', 'social', 'Template with pictures and text for explaining social situations', '["social", "stories", "explanation"]', 'Hard', 'BookOpen', 'indigo', 15)
    `;

    // Audio Tools
    await sql`
      INSERT INTO communication_tools (title, description, type, category, content, audio_url, tags, difficulty, icon, color, sort_order) VALUES
      ('Voice Output Device', 'Digital tool that speaks selected phrases', 'audio', 'technology', 'Digital communication device with voice output', 'https://example.com/voice-device.mp3', '["technology", "voice", "digital"]', 'Medium', 'Volume2', 'teal', 16),
      ('Phrase Recorder', 'Tool to record and play back custom phrases', 'audio', 'technology', 'Device to record personal phrases and play them back', 'https://example.com/recorder.mp3', '["recording", "personal", "custom"]', 'Medium', 'Mic', 'pink', 17)
    `;

    console.log("✅ Sample data inserted");

    // Verify
    const count = await sql`SELECT COUNT(*) as count FROM communication_tools`;
    console.log(`📊 Total communication tools: ${count[0].count}`);

    console.log("🎉 Communication tools table setup completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createCommunicationToolsTable();
