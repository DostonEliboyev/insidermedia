/**
 * Environment Variables Checker
 * 
 * Run this script to verify your .env file is configured correctly:
 * node scripts/check-env.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
const envPath = join(__dirname, '..', '.env');
const envExamplePath = join(__dirname, '..', '.env.example');

console.log('🔍 Checking environment configuration...\n');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.error(`   Expected location: ${envPath}\n`);
  
  if (fs.existsSync(envExamplePath)) {
    console.log('💡 To fix this:');
    console.log(`   1. Copy .env.example to .env:`);
    console.log(`      cp .env.example .env`);
    console.log(`   2. Edit .env and set your database credentials\n`);
  }
  process.exit(1);
}

// Load environment variables
dotenv.config({ path: envPath });

const requiredVars = {
  'DB_HOST': 'PostgreSQL host (usually localhost)',
  'DB_USER': 'PostgreSQL username (usually postgres)',
  'DB_PASSWORD': 'PostgreSQL password (REQUIRED - cannot be empty)',
  'DB_NAME': 'PostgreSQL database name',
  'JWT_SECRET': 'Secret key for JWT tokens (use a strong random string)',
  'PORT': 'Server port (default: 5000)'
};

let hasErrors = false;

console.log('📋 Environment Variables Status:\n');

for (const [varName, description] of Object.entries(requiredVars)) {
  const value = process.env[varName];
  
  if (!value || value.trim() === '') {
    console.error(`❌ ${varName}: NOT SET`);
    console.error(`   ${description}`);
    hasErrors = true;
  } else if (varName === 'DB_PASSWORD' && (value === 'your_password' || value.includes('change'))) {
    console.warn(`⚠️  ${varName}: Set but using default/example value`);
    console.warn(`   ${description}`);
    console.warn(`   Current value: ${value.substring(0, 10)}...`);
  } else if (varName === 'JWT_SECRET' && (value === 'your_super_secret_jwt_key_change_this_in_production' || value.length < 32)) {
    console.warn(`⚠️  ${varName}: Using weak or default secret`);
    console.warn(`   ${description}`);
    console.warn(`   For production, use a strong random string (at least 32 characters)`);
  } else {
    // Mask sensitive values
    const displayValue = varName.includes('PASSWORD') || varName.includes('SECRET')
      ? '*'.repeat(Math.min(value.length, 20))
      : value;
    console.log(`✓ ${varName}: ${displayValue}`);
  }
}

console.log('');

if (hasErrors) {
  console.error('❌ Configuration incomplete. Please fix the errors above.\n');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!\n');
  
  // Test database connection
  console.log('🔌 Testing database connection...');
  try {
    const pg = await import('pg');
    const { Pool } = pg;
    
    const testPool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 5432,
    });
    
    const client = await testPool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log(`   Server time: ${result.rows[0].now}\n`);
    client.release();
    await testPool.end();
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error(`   Error: ${error.message}\n`);
    console.error('💡 Troubleshooting:');
    console.error('   1. Verify PostgreSQL is running');
    console.error('   2. Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env');
    console.error('   3. Ensure the database exists: CREATE DATABASE news_db;');
    console.error('   4. Check PostgreSQL is listening on port 5432\n');
    process.exit(1);
  }
}
