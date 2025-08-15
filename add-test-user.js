import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration matching Docker setup
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5433,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'auth_chat_db',
  ssl: false
};

// Create PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Initialize Drizzle ORM
const db = drizzle(pool);

async function addTestUser() {
  try {
    console.log('Adding test user to database...');
    
    // Add a test user using raw SQL
    const result = await pool.query(`
      INSERT INTO users (name, email, role, admin_approved, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, admin_approved, created_at
    `, ['Test User', 'test@example.com', 'user', true, 'hashed_password_here']);
    
    const newUser = result.rows[0];
    console.log('✅ Test user added successfully!');
    console.log('User details:', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      approved: newUser.admin_approved,
      createdAt: newUser.created_at
    });
    
    // Show all users after adding
    const allUsers = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`\n📊 Total users in database: ${allUsers.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Failed to add test user:', error.message);
  } finally {
    await pool.end();
  }
}

addTestUser();
