import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  if (!session?.user) {
    throw redirect(302, '/login?role=admin');
  }

  if (session.user.role !== 'admin') {
    throw redirect(302, '/dashboard');
  }

  return {
    session
  };
};
