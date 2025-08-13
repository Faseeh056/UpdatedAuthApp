import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { userService } from '$lib/server/services/user-service';

export const PUT: RequestHandler = async ({ request, locals }) => {
  const session = await locals.getSession();

  if (!session?.user) {
    return json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if email is already in use by another user
    if (email !== session.user.email) {
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser && existingUser.id !== session.user.id) {
        return json({ message: 'Email already in use' }, { status: 409 });
      }
    }

    // Update user
    const updatedUser = await userService.updateUser({
      id: session.user.id,
      name,
      email
    });

    // Return success response without sensitive data
    return json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return json({ message: 'An error occurred while updating profile' }, { status: 500 });
  }
};