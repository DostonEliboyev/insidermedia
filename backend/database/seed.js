import bcrypt from 'bcrypt';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SECURITY: Admin User Seed Script
 * 
 * This script is the ONLY secure way to create admin users.
 * It runs directly against the database, bypassing API endpoints.
 * 
 * SECURITY MEASURES:
 * - Only executable via command line (npm run setup-db)
 * - Requires direct database access
 * - Role is hardcoded to 'admin' (cannot be manipulated)
 * - Password is properly hashed with bcrypt
 */
const seedDatabase = async () => {
  try {
    // SECURITY: Hardcoded role - cannot be manipulated
    const username = 'admin';
    const password = 'admin123';
    const role = 'admin'; // Explicitly set - cannot be changed via API
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // SECURITY: Role is explicitly set in query - no user input
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING *',
      [username, hashedPassword, role]
    );

    if (result.rows.length > 0) {
      console.log('✓ Default admin user created:');
      console.log('  Username: admin');
      console.log('  Password: admin123');
      console.log('  ⚠️  SECURITY: Change this password in production!');
    } else {
      console.log('✓ Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
