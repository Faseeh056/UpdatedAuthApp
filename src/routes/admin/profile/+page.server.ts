import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  if (!session) {
    throw redirect(302, '/admin/login');
  }

  // Check if user is admin
  if (session.user?.role !== 'admin') {
    throw redirect(302, '/admin/login');
  }

  return {
    session
  };
};
