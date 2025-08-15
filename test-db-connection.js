import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

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
    client.release();

    // Check if user table exists (renamed from users to match Auth.js)
    const userTableExists = await db.execute(sql`SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'user'
    )`);
    
    if (userTableExists.rows[0].exists) {
      console.log('✅ User table exists!');
      
      // Get user count
      const userCount = await db.execute(sql`SELECT COUNT(*) as count FROM "user"`);
      const count = parseInt(userCount.rows[0].count);
      console.log(`📊 Total users in database: ${count}`);
      
      if (count > 0) {
        // Get user details
        const users = await db.execute(sql`
          SELECT name, email, role, "adminApproved", "createdAt" 
          FROM "user" 
          ORDER BY "createdAt" DESC
        `);
        
        console.log('\n👥 Users in database:');
        users.rows.forEach((user, index) => {
          const createdDate = new Date(user.createdAt);
          console.log(`${index + 1}. ${user.name || 'No name'} (${user.email}) - Role: ${user.role} - Approved: ${user.adminApproved} - Created: ${createdDate.toDateString()}`);
        });
      }
    } else {
      console.log('❌ User table does not exist!');
    }

    // List all available tables
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📋 Available tables:');
    tables.rows.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
