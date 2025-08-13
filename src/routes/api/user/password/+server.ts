import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { userService } from '$lib/server/services/user-service';
import bcrypt from 'bcrypt';

export const PUT: RequestHandler = async ({ request, locals }) => {
  const session = await locals.getSession();

  if (!session?.user) {
    return json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Get user with password hash
    const user = await userService.getUserById(session.user.id);

    if (!user || !user.password) {
      return json({ message: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return json({ message: 'Current password is incorrect' }, { status: 400 });
    }

    // Update password
    await userService.updateUser({
      id: session.user.id,
      password: newPassword
    });

    return json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    return json({ message: 'An error occurred while updating password' }, { status: 500 });
  }
};