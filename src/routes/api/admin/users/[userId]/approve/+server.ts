import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async ({ params, locals }) => {
  try {
    console.log('Admin approval endpoint called');
    
    const session = await locals.getSession();
    console.log('Session:', session);

    // Check if user is authenticated and is an admin
    if (!session?.user?.id) {
      console.log('No session user ID');
      return json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      console.log('User role is not admin:', session.user.role);
      return json({ error: 'Not authorized - admin access required' }, { status: 401 });
    }

    const { userId } = params;
    console.log('Approving user ID:', userId);

    if (!userId) {
      return json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get the user to be approved
    const userToApprove = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    console.log('User to approve:', userToApprove);

    if (!userToApprove) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is an admin and not already approved
    if (userToApprove.role !== 'admin') {
      return json({ error: 'User is not an admin' }, { status: 400 });
    }

    if (userToApprove.adminApproved) {
      return json({ error: 'User is already approved' }, { status: 400 });
    }

    // Approve the admin user
    await db.update(users)
      .set({
        adminApproved: true,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    console.log('Admin user approved successfully');

    return json({
      success: true,
      message: 'Admin user approved successfully'
    });

  } catch (error) {
    console.error('Admin approval error:', error);
    return json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
};
