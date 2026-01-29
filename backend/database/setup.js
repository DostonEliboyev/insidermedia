import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const setupDatabase = async () => {
  try {
    console.log('Setting up database...');
    
    // Read schema file
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await pool.query(schema);
    console.log('✓ Database schema created successfully');
    
    // SECURITY: Seed admin user - ONLY secure way to create admins
    const bcrypt = (await import('bcrypt')).default;
    const username = 'admin';
    const password = 'admin123';
    const role = 'admin'; // SECURITY: Hardcoded - cannot be manipulated
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // SECURITY: Role is explicitly set - no user input can change it
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING *',
      [username, hashedPassword, role]
    );

    if (result.rows.length > 0) {
      console.log('✓ Default admin user created');
      console.log('  Username: admin');
      console.log('  Password: admin123');
    } else {
      console.log('✓ Admin user already exists');
    }
    
    console.log('\n✓ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error setting up database:', error);
    process.exit(1);
  }
};

setupDatabase();
