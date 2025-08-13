import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  
  // If already logged in as admin, redirect to admin dashboard
  if (session?.user?.role === 'admin') {
    throw redirect(302, '/admin');
  }

  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!name || !email || !password || !confirmPassword) {
      return fail(400, {
        error: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return fail(400, {
        error: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return fail(400, {
        error: 'Password must be at least 6 characters long'
      });
    }

    try {
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (existingUser) {
        return fail(400, {
          error: 'A user with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin user with pending approval
      await db.insert(users).values({
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        role: 'admin',
        adminApproved: false // Pending approval
      });

      return {
        success: 'Admin registration successful! Your account is pending approval from an existing admin. You will be able to sign in once approved.'
      };

    } catch (error) {
      console.error('Admin registration error:', error);
      return fail(500, {
        error: 'Internal server error. Please try again.'
      });
    }
  }
};
