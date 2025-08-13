import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to database');

    // Create admin user
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin already exists
    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [adminEmail]
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️  Admin user already exists');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
      console.log('Role: admin');
    } else {
      // Insert admin user
      await client.query(
        `INSERT INTO users (id, name, email, password, role, email_verified) 
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)`,
        ['Admin User', adminEmail, hashedPassword, 'admin', new Date()]
      );

      console.log('✅ Admin user created successfully');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
      console.log('Role: admin');
    }

    client.release();
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
  } finally {
    await pool.end();
  }
}

createAdminUser();

