import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  // Check if user is authenticated
  if (!session?.user) {
    throw redirect(303, '/login');
  }

  // Return session data for the dashboard
  return {
    session,
    user: session.user
  };
};