import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createTables() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const pool = new Pool({ connectionString });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to database successfully');

    // Create drizzle schema first
    console.log('Creating drizzle schema...');
    await client.query('CREATE SCHEMA IF NOT EXISTS drizzle;');
    console.log('✅ Drizzle schema created');

    // Create users table
    console.log('Creating users table...');
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

    // Create sessions table
    console.log('Creating sessions table...');
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

    // Create verification_token table
    console.log('Creating verification_token table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_token (
        identifier VARCHAR(255) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `);
    console.log('✅ Verification token table created');

    // Create accounts table
    console.log('Creating accounts table...');
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

    // Create indexes
    console.log('Creating indexes...');
    await client.query('CREATE INDEX IF NOT EXISTS email_idx ON users(email);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON sessions(session_token);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider);');
    console.log('✅ Indexes created');

    // Grant permissions
    console.log('Granting permissions...');
    try {
      await client.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "Login";');
      await client.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "Login";');
      await client.query('GRANT ALL PRIVILEGES ON SCHEMA public TO "Login";');
      await client.query('GRANT ALL PRIVILEGES ON SCHEMA drizzle TO "Login";');
      await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "Login";');
      await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "Login";');
      console.log('✅ Permissions granted');
    } catch (error) {
      console.log('⚠️  Permission granting failed (this is normal if you\'re not a superuser):', error.message);
    }

    client.release();
    console.log('🎉 All tables created successfully!');
    console.log('Your authentication app should now work properly.');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createTables();
