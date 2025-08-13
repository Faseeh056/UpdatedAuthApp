import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.getSession();

    // Check if user is authenticated
    if (!session?.user?.id) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await request.json();

    if (!name || !email) {
      return json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Check if email is already taken by another user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return json({ error: 'Email is already taken by another user' }, { status: 400 });
    }

    // Update user profile in database
    await db.update(users)
      .set({
        name: name.trim(),
        email: email.trim(),
        updatedAt: new Date()
      })
      .where(eq(users.id, session.user.id));

    return json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
