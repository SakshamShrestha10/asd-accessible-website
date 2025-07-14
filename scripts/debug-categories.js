#!/usr/bin/env node

const { neon } = require("@neondatabase/serverless");

async function debugCategories() {
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

    console.log("\n📊 Checking learning_categories table structure...");

    // Check table structure
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'learning_categories' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;

    console.log("Table columns:");
    columns.forEach((col) => {
      console.log(
        `  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`
      );
    });

    // Check if table exists and has data
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'learning_categories'
      ) as exists
    `;

    console.log(`\nTable exists: ${tableExists[0]?.exists}`);

    if (tableExists[0]?.exists) {
      const count =
        await sql`SELECT COUNT(*) as count FROM learning_categories`;
      console.log(`Current categories count: ${count[0]?.count || 0}`);

      if (count[0]?.count > 0) {
        const categories =
          await sql`SELECT * FROM learning_categories ORDER BY id`;
        console.log("Existing categories:", categories);
      }

      // Test inserting a category
      console.log("\n🧪 Testing category insertion...");
      try {
        const testResult = await sql`
          INSERT INTO learning_categories (
            name, 
            description, 
            color,
            sort_order,
            is_active
          ) VALUES (
            'Test Category', 
            'Test Description', 
            '#FF0000',
            999,
            true
          ) RETURNING id, name, description, color
        `;

        console.log("✅ Test category created successfully:", testResult[0]);

        // Clean up test data
        await sql`DELETE FROM learning_categories WHERE name = 'Test Category'`;
        console.log("🧹 Test category cleaned up");
      } catch (insertError) {
        console.error(
          "❌ Test category insertion failed:",
          insertError.message
        );
        console.error("Error details:", {
          code: insertError.code,
          detail: insertError.detail,
          hint: insertError.hint,
        });
      }
    }

    console.log("\n✅ Debug completed!");
  } catch (error) {
    console.error("❌ Debug failed:", error.message);
    console.error("Error details:", {
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });
    process.exit(1);
  }
}

debugCategories();
