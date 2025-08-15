import { sequence } from '@sveltejs/kit/hooks';
import { authHandle, protectHandle } from '$lib/server/auth';

// Combine auth and route protection using sequence
export const handle = sequence(authHandle.handle, protectHandle);