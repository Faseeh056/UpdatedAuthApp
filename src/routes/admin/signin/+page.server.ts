import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
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
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return fail(400, {
        error: 'Email and password are required'
      });
    }

    try {
      // Find user by email
      const user = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (!user) {
        return fail(400, {
          error: 'Invalid email or password'
        });
      }

      // Check if user is trying to sign in as admin
      if (user.role === 'admin') {
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password || '');
        
        if (!isPasswordValid) {
          return fail(400, {
            error: 'Invalid email or password'
          });
        }

        // Check if admin is approved
        if (!user.adminApproved) {
          return fail(400, {
            error: 'Your admin account is pending approval. Please wait for an existing admin to approve your access.'
          });
        }

        // Sign in the admin user
        const session = await auth.createSession({
          userId: user.id,
          attributes: {
            email: user.email,
            name: user.name,
            role: user.role
          }
        });

        locals.setSession(session);

        throw redirect(302, '/admin');
      } else {
        // User is not an admin
        return fail(400, {
          error: 'This account does not have admin privileges. Please sign in through the regular login page.'
        });
      }
    } catch (error) {
      console.error('Admin signin error:', error);
      return fail(500, {
        error: 'Internal server error. Please try again.'
      });
    }
  }
};
