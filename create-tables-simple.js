import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function createTables() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to database');

    // Create drizzle schema
    try {
      await client.query('CREATE SCHEMA IF NOT EXISTS drizzle;');
      console.log('✅ Drizzle schema created');
    } catch (error) {
      console.log('⚠️  Drizzle schema error (may already exist):', error.message);
    }

    // Create users table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255),
          email VARCHAR(255) UNIQUE NOT NULL,
          email_verified TIMESTAMP,
          password VARCHAR(255),
          role VARCHAR(20) NOT NULL DEFAULT 'client',
          image VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Users table created');
    } catch (error) {
      console.log('⚠️  Users table error:', error.message);
    }

    // Create sessions table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          id VARCHAR(255) PRIMARY KEY,
          user_id UUID NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          session_token VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);
      console.log('✅ Sessions table created');
    } catch (error) {
      console.log('⚠️  Sessions table error:', error.message);
    }

    // Create verification_token table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS verification_token (
          identifier VARCHAR(255) NOT NULL,
          token VARCHAR(255) UNIQUE NOT NULL,
          expires TIMESTAMP NOT NULL,
          PRIMARY KEY (identifier, token)
        );
      `);
      console.log('✅ Verification token table created');
    } catch (error) {
      console.log('⚠️  Verification token table error:', error.message);
    }

    // Create accounts table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS accounts (
          id VARCHAR(255) PRIMARY KEY,
          user_id UUID NOT NULL,
          type VARCHAR(255) NOT NULL,
          provider VARCHAR(255) NOT NULL,
          provider_account_id VARCHAR(255) NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          expires_at BIGINT,
          token_type VARCHAR(255),
          scope VARCHAR(255),
          id_token TEXT,
          session_state VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);
      console.log('✅ Accounts table created');
    } catch (error) {
      console.log('⚠️  Accounts table error:', error.message);
    }

    // Create indexes
    try {
      await client.query('CREATE INDEX IF NOT EXISTS email_idx ON users(email);');
      await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);');
      await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON sessions(session_token);');
      await client.query('CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);');
      await client.query('CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider);');
      console.log('✅ Indexes created');
    } catch (error) {
      console.log('⚠️  Index creation error:', error.message);
    }

    // Test if tables exist
    const tables = ['users', 'sessions', 'verification_token', 'accounts'];
    for (const table of tables) {
      try {
        const result = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = $1
          );
        `, [table]);
        console.log(`${table} table exists:`, result.rows[0].exists);
      } catch (error) {
        console.log(`Error checking ${table} table:`, error.message);
      }
    }

    client.release();
    console.log('🎉 Database setup completed!');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    await pool.end();
  }
}

createTables();
