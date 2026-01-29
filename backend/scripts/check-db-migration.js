/**
 * Check if database migration is needed
 * Run: node scripts/check-db-migration.js
 */

import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const checkMigration = async () => {
  try {
    console.log('🔍 Checking database migration status...\n');

    // Check if language column exists
    const result = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'news' AND column_name = 'language'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Language column exists!');
      console.log(`   Type: ${result.rows[0].data_type}`);
      console.log(`   Default: ${result.rows[0].column_default}\n`);
      console.log('✅ Database is ready for multi-language features.\n');
      process.exit(0);
    } else {
      console.log('❌ Language column NOT found!\n');
      console.log('💡 To fix this, run:');
      console.log('   npm run migrate-language\n');
      console.log('   Or manually run:');
      console.log('   psql -U postgres -d news_db -f database/migration_add_language.sql\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error checking migration:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. PostgreSQL is running');
    console.error('   2. Database exists');
    console.error('   3. .env file is configured correctly\n');
    process.exit(1);
  }
};

checkMigration();
