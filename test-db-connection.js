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

console.log('Testing database connection...');
console.log('Database config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database
});

// Create PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Initialize Drizzle ORM
const db = drizzle(pool);

async function testConnection() {
  try {
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Users table exists!');
      
      // Count users
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      console.log(`📊 Total users in database: ${userCount.rows[0].count}`);
      
      // Show all users
      const allUsers = await client.query('SELECT id, name, email, role, admin_approved, created_at FROM users ORDER BY created_at DESC');
      
      if (allUsers.rows.length > 0) {
        console.log('\n👥 Users in database:');
        allUsers.rows.forEach((user, index) => {
          console.log(`${index + 1}. ${user.name || 'No name'} (${user.email}) - Role: ${user.role} - Approved: ${user.admin_approved} - Created: ${user.created_at}`);
        });
      } else {
        console.log('📭 No users found in the database');
      }
      
      // Check other tables
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      
      console.log('\n📋 Available tables:');
      tables.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
      
    } else {
      console.log('❌ Users table does not exist!');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
