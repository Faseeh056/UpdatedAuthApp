import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const DELETE: RequestHandler = async ({ params, locals }) => {
  try {
    // Check if user is admin
    const session = await locals.getSession();
    if (!session?.user || session.user.role !== 'admin') {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;

    // Prevent admin from deleting themselves
    if (userId === session.user.id) {
      return json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Delete user
    await db.delete(users).where(eq(users.id, userId));

    return json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
