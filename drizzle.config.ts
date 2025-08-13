import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || 'Login',
    password: process.env.DB_PASSWORD || 'faseeh565',
    database: process.env.DB_NAME || 'auth_app_db',
    ssl: false, // ✅ Add this line
  },
} satisfies Config;
