import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.getSession();
    if (session?.user) {
        // Redirect based on user role
        if (session.user.role === 'admin') {
            throw redirect(302, '/admin');
        } else {
            throw redirect(302, '/dashboard');
        }
    }
    return {};
};