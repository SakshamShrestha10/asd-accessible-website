#!/usr/bin/env node

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function createAssessmentsTable() {
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

    console.log("🌱 Creating assessments table...");

    // Create the table
    await sql`
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(50),
        questions JSONB DEFAULT '[]'::jsonb,
        instructions TEXT,
        duration VARCHAR(100),
        difficulty VARCHAR(50),
        icon VARCHAR(50),
        color VARCHAR(20),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("✅ assessments table created");

    // Insert sample data
    console.log("🌱 Inserting sample data...");

    // Autism Screening Assessment
    await sql`
      INSERT INTO assessments (title, description, type, category, questions, instructions, duration, difficulty, icon, color, sort_order) VALUES
      ('Autism Spectrum Screening', 'A comprehensive screening tool to assess potential autism spectrum traits', 'screening', 'autism', '[
        {"id": 1, "question": "Does your child make eye contact when you talk to them?", "type": "likert", "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]},
        {"id": 2, "question": "Does your child respond to their name when called?", "type": "likert", "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]},
        {"id": 3, "question": "Does your child engage in repetitive behaviors?", "type": "likert", "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]},
        {"id": 4, "question": "Does your child have difficulty with social interactions?", "type": "likert", "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]},
        {"id": 5, "question": "Does your child have specific interests they focus on intensely?", "type": "likert", "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]}
      ]', 'Answer each question based on your observations of the child. Be as honest as possible.', '10-15 minutes', 'Easy', 'ClipboardCheck', 'blue', 1)
    `;

    // Sensory Processing Assessment
    await sql`
      INSERT INTO assessments (title, description, type, category, questions, instructions, duration, difficulty, icon, color, sort_order) VALUES
      ('Sensory Processing Assessment', 'Evaluate sensory sensitivities and preferences', 'diagnostic', 'sensory', '[
        {"id": 1, "question": "How do you react to loud noises?", "type": "likert", "options": ["Very distressed", "Uncomfortable", "Neutral", "Comfortable", "Seeking"]},
        {"id": 2, "question": "How do you feel about bright lights?", "type": "likert", "options": ["Very distressed", "Uncomfortable", "Neutral", "Comfortable", "Seeking"]},
        {"id": 3, "question": "How do you respond to different textures?", "type": "likert", "options": ["Very distressed", "Uncomfortable", "Neutral", "Comfortable", "Seeking"]},
        {"id": 4, "question": "How do you feel about being touched?", "type": "likert", "options": ["Very distressed", "Uncomfortable", "Neutral", "Comfortable", "Seeking"]},
        {"id": 5, "question": "How do you respond to strong smells?", "type": "likert", "options": ["Very distressed", "Uncomfortable", "Neutral", "Comfortable", "Seeking"]}
      ]', 'Rate your typical response to each sensory experience.', '8-12 minutes', 'Easy', 'Zap', 'purple', 2)
    `;

    // Communication Assessment
    await sql`
      INSERT INTO assessments (title, description, type, category, questions, instructions, duration, difficulty, icon, color, sort_order) VALUES
      ('Communication Skills Assessment', 'Assess verbal and non-verbal communication abilities', 'diagnostic', 'communication', '[
        {"id": 1, "question": "How easily do you start conversations?", "type": "likert", "options": ["Very difficult", "Difficult", "Sometimes", "Easy", "Very easy"]},
        {"id": 2, "question": "How well do you understand facial expressions?", "type": "likert", "options": ["Very difficult", "Difficult", "Sometimes", "Easy", "Very easy"]},
        {"id": 3, "question": "How comfortable are you with eye contact?", "type": "likert", "options": ["Very uncomfortable", "Uncomfortable", "Neutral", "Comfortable", "Very comfortable"]},
        {"id": 4, "question": "How well do you follow group conversations?", "type": "likert", "options": ["Very difficult", "Difficult", "Sometimes", "Easy", "Very easy"]},
        {"id": 5, "question": "How easily do you express your feelings?", "type": "likert", "options": ["Very difficult", "Difficult", "Sometimes", "Easy", "Very easy"]}
      ]', 'Rate your comfort and ability level with each communication aspect.', '12-15 minutes', 'Medium', 'MessageSquare', 'green', 3)
    `;

    // Anxiety Assessment
    await sql`
      INSERT INTO assessments (title, description, type, category, questions, instructions, duration, difficulty, icon, color, sort_order) VALUES
      ('Anxiety Level Assessment', 'Evaluate current anxiety levels and triggers', 'screening', 'mental_health', '[
        {"id": 1, "question": "How often do you feel worried or anxious?", "type": "likert", "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]},
        {"id": 2, "question": "How much do anxiety symptoms interfere with daily activities?", "type": "likert", "options": ["Not at all", "Slightly", "Moderately", "Significantly", "Severely"]},
        {"id": 3, "question": "How often do you experience physical symptoms of anxiety?", "type": "likert", "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]},
        {"id": 4, "question": "How difficult is it to control worrying thoughts?", "type": "likert", "options": ["Very easy", "Easy", "Sometimes", "Difficult", "Very difficult"]},
        {"id": 5, "question": "How often do you avoid situations due to anxiety?", "type": "likert", "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]}
      ]', 'Answer based on your experiences over the past month.', '10-12 minutes', 'Easy', 'Heart', 'red', 4)
    `;

    // Executive Function Assessment
    await sql`
      INSERT INTO assessments (title, description, type, category, questions, instructions, duration, difficulty, icon, color, sort_order) VALUES
      ('Executive Function Assessment', 'Evaluate planning, organization, and task management skills', 'diagnostic', 'cognitive', '[
        {"id": 1, "question": "How well do you plan and organize tasks?", "type": "likert", "options": ["Very poor", "Poor", "Average", "Good", "Excellent"]},
        {"id": 2, "question": "How often do you complete tasks on time?", "type": "likert", "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]},
        {"id": 3, "question": "How easily do you switch between different tasks?", "type": "likert", "options": ["Very difficult", "Difficult", "Sometimes", "Easy", "Very easy"]},
        {"id": 4, "question": "How well do you remember important details?", "type": "likert", "options": ["Very poor", "Poor", "Average", "Good", "Excellent"]},
        {"id": 5, "question": "How often do you lose track of time?", "type": "likert", "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]}
      ]', 'Rate your typical performance in each area.', '15-20 minutes', 'Medium', 'Brain', 'orange', 5)
    `;

    console.log("✅ Sample data inserted");

    // Verify
    const count = await sql`SELECT COUNT(*) as count FROM assessments`;
    console.log(`📊 Total assessments: ${count[0].count}`);

    console.log("🎉 Assessments table setup completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createAssessmentsTable();
