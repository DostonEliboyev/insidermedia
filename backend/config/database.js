import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Please create a .env file in the backend directory with the required variables.');
  console.error('   You can copy .env.example and update the values.');
  process.exit(1);
}

// Ensure password is a string (even if empty)
const dbPassword = String(process.env.DB_PASSWORD || '');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME,
  port: 5432,
});

pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('✗ Database connection error:', err.message);
  if (err.message.includes('password')) {
    console.error('\n💡 Check your DB_PASSWORD in .env file');
  }
  // Don't exit in production - let the app handle reconnection
  if (process.env.NODE_ENV !== 'production') {
    process.exit(-1);
  }
});

export default pool;
