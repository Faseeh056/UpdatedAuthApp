import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  // If user is already logged in, redirect them to appropriate dashboard
  if (session) {
    if (session.user.role === 'admin') {
      throw redirect(303, '/admin');
    } else {
      throw redirect(303, '/dashboard');
    }
  }

  return {
    session
  };
};
