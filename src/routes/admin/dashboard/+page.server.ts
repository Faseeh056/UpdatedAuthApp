import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userService } from '$lib/server/services/user-service';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  // Check if user is authenticated
  if (!session?.user) {
    throw redirect(303, '/login');
  }

  // Check if user is an admin
  if (session.user.role !== 'admin') {
    throw redirect(303, '/dashboard');
  }

  // Get all users for admin dashboard
  const users = await userService.getAllUsers();
  
  // Remove password hashes before sending to client
  const safeUsers = users.map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });

  return {
    session,
    users: safeUsers,
    userCount: safeUsers.length
  };
};