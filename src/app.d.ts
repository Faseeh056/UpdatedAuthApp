// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { Session, User } from '@auth/core/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession(): Promise<Session | null>;
			signOut: (options?: { redirectTo?: string }) => Promise<void>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

// Auth.js type extensions
declare module '@auth/core/types' {
	interface Session {
		user?: User & {
			id: string;
			role?: string;
		};
	}

	interface User {
		role?: string;
	}
}

export {};
