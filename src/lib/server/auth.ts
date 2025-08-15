import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

// Define Auth.js compatible table names for the adapter
const authTables = {
  users: 'user',
  accounts: 'account', 
  sessions: 'session',
  verificationTokens: 'verification_token'
};
import { eq } from 'drizzle-orm';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import Credentials from '@auth/core/providers/credentials';
import Google from '@auth/core/providers/google';
import GitHub from '@auth/core/providers/github';
import bcrypt from 'bcrypt';
import type { Provider } from '@auth/core/providers';
import { 
  AUTH_SECRET, 
  GOOGLE_CLIENT_ID, 
  GOOGLE_CLIENT_SECRET, 
  GITHUB_CLIENT_ID, 
  GITHUB_CLIENT_SECRET 
} from '$env/static/private';

// Auth.js configuration
export const authHandle = SvelteKitAuth({
  adapter: DrizzleAdapter(db),
  secret: AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.query.users.findFirst({
          where: (users) => eq(users.email, credentials.email as string)
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(credentials.password as string, user.password);

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role
        };
      }
    }) as Provider,
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      console.log('🔍 SignIn callback:', { user: user.email, provider: account?.provider });
      
      // For OAuth providers, set default role for new users
      if (account?.provider === 'google' || account?.provider === 'github') {
        console.log('✅ OAuth user signing in, adapter will handle user creation');
        // Set default role for new users - this will be used by the adapter
        if (!user.role) {
          user.role = 'client';
        }
      }
      
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

// Protect routes that require authentication
export const protectHandle = (async ({ event, resolve }) => {
  // List of protected routes
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/admin',
  ];

  // List of admin-only routes (excluding login and register)
  const adminRoutes = [
    '/admin',
  ];

  // List of public routes that should not be protected
  const publicRoutes = [
    '/admin/login',
    '/admin/register',
    '/login',
    '/register',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ];

  const session = await event.locals.getSession();
  const path = event.url.pathname;

  // Skip protection for public routes
  if (publicRoutes.some(route => path.startsWith(route))) {
    return resolve(event);
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute && !session) {
    throw redirect(303, '/login');
  }

  // Check for admin access
  if (isAdminRoute && session?.user?.role !== 'admin') {
    throw redirect(303, '/dashboard');
  }

  return resolve(event);
}) satisfies Handle;

// Combined handle export - this will be imported in hooks.server.ts