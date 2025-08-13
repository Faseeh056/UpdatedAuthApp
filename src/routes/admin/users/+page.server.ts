import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userService } from '$lib/server/services/user-service';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  if (!session?.user) {
    throw redirect(302, '/login?role=admin');
  }

  if (session.user.role !== 'admin') {
    throw redirect(302, '/dashboard');
  }

  try {
    // Get all users for user management
    const users = await userService.getAllUsers();

    return {
      session,
      users
    };
  } catch (error) {
    console.error('Error loading users data:', error);
    return {
      session,
      users: []
    };
  }
};
