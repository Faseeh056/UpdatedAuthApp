import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { join } from 'path';

// Create SQLite database connection
const dbPath = join(process.cwd(), 'sqlite.db');
console.log(`Using database at: ${dbPath}`);

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

console.log('Running migrations...');

try {
  migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migrations completed successfully');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
} finally {
  sqlite.close();
}