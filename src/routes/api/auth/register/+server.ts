import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { userService } from '$lib/server/services/user-service';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, email, password, role = 'client' } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Validate role
    if (!['client', 'admin'].includes(role)) {
      return json({ message: 'Invalid role' }, { status: 400 });
    }

    // Create user with role
    const user = await userService.createUser({ name, email, password, role });

    // Return success response without sensitive data
    return json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'User registered successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error && error.message === 'User with this email already exists') {
      return json({ message: 'Email already in use' }, { status: 409 });
    }

    return json({ message: 'An error occurred during registration' }, { status: 500 });
  }
};