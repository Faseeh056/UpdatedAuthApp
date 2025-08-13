import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // Redirect old signup page to new client signup page
  throw redirect(301, '/client-signup');
};
