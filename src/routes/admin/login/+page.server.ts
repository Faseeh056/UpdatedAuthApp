import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  // If user is already logged in, redirect appropriately
  if (session?.user) {
    if (session.user.role === 'admin') {
      throw redirect(302, '/admin');
    } else {
      throw redirect(302, '/dashboard');
    }
  }

  // Check if any admin users exist
  const adminUsers = await db.query.users.findMany({
    where: eq(users.role, 'admin')
  });

  // If no admin users exist, redirect to admin registration
  if (adminUsers.length === 0) {
    throw redirect(302, '/admin/register');
  }

  return {
    session,
    hasAdminUsers: adminUsers.length > 0
  };
};
