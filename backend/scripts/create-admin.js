/**
 * Create Admin User Script
 * 
 * This script creates an admin user in the database.
 * 
 * Usage:
 *   Interactive mode: node scripts/create-admin.js
 *   With arguments: node scripts/create-admin.js <username> <password>
 * 
 * Example:
 *   node scripts/create-admin.js admin mypassword123
 */

import bcrypt from 'bcrypt';
import pool from '../config/database.js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

/**
 * Prompts user for input
 */
const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

/**
 * Validates password strength
 */
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
};

/**
 * Creates an admin user in the database
 */
const createAdminUser = async (username, password) => {
  try {
    // Validate inputs
    if (!username || username.trim() === '') {
      throw new Error('Username is required');
    }

    if (!password || password.trim() === '') {
      throw new Error('Password is required');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id, username FROM users WHERE username = $1',
      [username.trim()]
    );

    if (existingUser.rows.length > 0) {
      console.log(`\n⚠️  User "${username}" already exists!`);
      const overwrite = await askQuestion('Do you want to update the password? (y/n): ');
      
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Operation cancelled.');
        process.exit(0);
      }

      // Update existing user's password
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET password = $1 WHERE username = $2',
        [hashedPassword, username.trim()]
      );

      console.log(`\n✅ Admin user "${username}" password updated successfully!`);
      console.log(`   Username: ${username}`);
      console.log(`   ⚠️  SECURITY: Keep this password secure!\n`);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // SECURITY: Role is hardcoded to 'admin' - cannot be manipulated
    const role = 'admin';

    // Insert new admin user
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
      [username.trim(), hashedPassword, role]
    );

    const user = result.rows[0];

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Created: ${user.created_at}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n⚠️  SECURITY: Keep these credentials secure!`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Password: ${password}\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error(`   ${error.message}\n`);

    if (error.code === '23505') {
      console.error('💡 This username already exists. Use a different username.\n');
    } else if (error.message.includes('password')) {
      console.error('💡 Password validation failed. Please try again.\n');
    } else {
      console.error('💡 Make sure:');
      console.error('   1. Database is running');
      console.error('   2. .env file is configured correctly');
      console.error('   3. Database schema is set up (run: npm run setup-db)\n');
    }

    process.exit(1);
  }
};

// Main execution
const main = async () => {
  console.log('🔐 Create Admin User\n');

  let username, password;

  // Check if username and password are provided as command-line arguments
  if (process.argv.length >= 4) {
    username = process.argv[2];
    password = process.argv[3];
  } else {
    // Interactive mode
    console.log('Enter admin user credentials:\n');

    username = await askQuestion('Username: ');
    if (!username || username.trim() === '') {
      console.error('\n❌ Username cannot be empty!\n');
      process.exit(1);
    }

    // Hide password input (basic implementation)
    password = await askQuestion('Password: ');
    if (!password || password.trim() === '') {
      console.error('\n❌ Password cannot be empty!\n');
      process.exit(1);
    }

    const confirmPassword = await askQuestion('Confirm Password: ');
    if (password !== confirmPassword) {
      console.error('\n❌ Passwords do not match!\n');
      process.exit(1);
    }
  }

  await createAdminUser(username, password);
};

// Run the script
main().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
