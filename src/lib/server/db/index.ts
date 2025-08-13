import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set in environment variables');
  console.error('Please check your .env file and ensure it contains:');
  console.error('DATABASE_URL=postgres://username:password@localhost:5432/dbname');
  throw new Error('DATABASE_URL is not set. Please check your .env file in the project root and ensure it is formatted as DATABASE_URL=postgres://username:password@localhost:5432/dbname');
}

console.log('DATABASE_URL found:', connectionString.substring(0, 20) + '...');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err: Error) => {
  console.error('PostgreSQL connection error:', err);
});

export const db = drizzle(pool, { schema });