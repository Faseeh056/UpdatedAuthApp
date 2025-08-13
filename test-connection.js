import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;
  console.log('DATABASE_URL:', connectionString ? 'Found' : 'Not found');

  const pool = new Pool({ connectionString });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to database successfully');

    // Test a simple query
    const result = await client.query('SELECT current_database(), current_user;');
    console.log('Database info:', result.rows[0]);

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'users'
      );
    `);
    console.log('Users table exists:', tableCheck.rows[0].exists);

    client.release();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
