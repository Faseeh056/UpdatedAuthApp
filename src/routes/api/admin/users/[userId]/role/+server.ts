import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async ({ request, params, locals }) => {
  try {
    console.log('Role update request received');
    
    // Check if user is admin
    const session = await locals.getSession();
    console.log('Session:', session);
    
    if (!session?.user || session.user.role !== 'admin') {
      console.log('Unauthorized access attempt - user role:', session?.user?.role);
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;
    const { role } = await request.json();
    
    console.log('Updating user role - User ID:', userId, 'New Role:', role);

    // Validate role - accept all valid roles from schema
    if (!role || !['admin', 'client', 'user'].includes(role)) {
      console.log('Invalid role provided:', role);
      return json({ error: 'Invalid role. Must be admin, client, or user' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!existingUser) {
      console.log('User not found:', userId);
      return json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Current user role:', existingUser.role, 'New role:', role);

    // Update user role
    const [updatedUser] = await db.update(users)
      .set({ 
        role,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    console.log('User role updated successfully:', updatedUser);

    // Invalidate all sessions for this user to force re-login with new role
    await db.delete(sessions).where(eq(sessions.userId, userId));
    console.log('Sessions invalidated for user:', userId);

    return json({ 
      message: 'User role updated successfully. User will need to log in again with their new role.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Failed to update user role:', error);
    return json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};