import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Check if user is admin
    const session = await locals.getSession();
    if (!session?.user || session.user.role !== 'admin') {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all users
    const allUsers = await db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true
      }
    });

    return json(allUsers);
  } catch (error) {
    console.error('Failed to get users:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
