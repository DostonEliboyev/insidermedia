/**
 * Migration script to add language column to existing news table
 * Run: node scripts/migrate-language.js
 */

import pool from '../config/database.js';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrateLanguage = async () => {
  try {
    console.log('🔄 Starting language migration...\n');

    // Check if column already exists
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'news' AND column_name = 'language'
    `);

    if (checkResult.rows.length > 0) {
      console.log('ℹ️  Language column already exists. Migration may have already been run.');
      console.log('✅ Migration not needed.\n');
      process.exit(0);
    }

    // Read migration SQL file
    const migrationPath = join(__dirname, '../database/migration_add_language.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute migration
    await pool.query(migrationSQL);
    console.log('✅ Language column added successfully');
    console.log('✅ Constraint added successfully');
    console.log('✅ Indexes created successfully\n');

    // Update existing records to have default language
    const updateResult = await pool.query("UPDATE news SET language = 'en' WHERE language IS NULL");
    console.log(`✅ Updated ${updateResult.rowCount} existing records to English (en)\n`);

    console.log('✅ Migration completed successfully!');
    console.log('💡 You can now use multi-language features.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('   Error code:', error.code);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure PostgreSQL is running');
    console.error('   2. Check your .env file has correct database credentials');
    console.error('   3. Ensure the news table exists');
    console.error('   4. Try running: npm run check-env\n');
    process.exit(1);
  }
};

migrateLanguage();
