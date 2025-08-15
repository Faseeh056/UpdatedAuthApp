import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/server/db';
import { users, accounts, sessions, verificationTokens } from '$lib/server/db/schema';

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

// Validate environment variables
function validateEnvVars() {
  const required = {
    AUTH_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET
  };

  const missing = Object.entries(required)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('✅ All required environment variables are present');
}

// Validate environment variables before creating auth config
validateEnvVars();

// Auth.js configuration with unified user management
export const authHandle = SvelteKitAuth({
  adapter: DrizzleAdapter(db),
  secret: AUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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
        try {
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
        } catch (error) {
          console.error('❌ Error in credentials authorize:', error);
          return null;
        }
      }
    }) as Provider,
  ],
  callbacks: {
    async session({ session, user }) {
      try {
        if (session.user && user) {
          session.user.id = user.id;
          session.user.role = user.role;
        }
        return session;
      } catch (error) {
        console.error('❌ Error in session callback:', error);
        return session;
      }
    },
    async signIn({ user, account, profile }) {
      try {
        // For OAuth providers, ensure proper user setup
        if (account?.provider === 'google' || account?.provider === 'github') {
          console.log('✅ OAuth user signing in, provider:', account.provider);
          
          // Set default role for new users if not already set
          if (!user.role) {
            user.role = 'client';
          }
          
          // Ensure user has required fields
          if (!user.name && profile?.name) {
            user.name = profile.name;
          }
          
          if (!user.email && profile?.email) {
            user.email = profile.email;
          }
        }
        
        return true;
      } catch (error) {
        console.error('❌ Error in signIn callback:', error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Handle OAuth callback URLs - redirect to dashboard after successful auth
      if (url.includes('/auth/callback/')) {
        return `${baseUrl}/dashboard`;
      }
      
      // Handle error URLs - redirect to login with error
      if (url.includes('error=')) {
        return `${baseUrl}/login?error=oauth_failed`;
      }
      
      // If the URL is relative, make it absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // If the URL is on the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      // Default redirect to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

// Log OAuth configuration for debugging
console.log('🔧 OAuth Configuration:');
console.log('  - Google Client ID:', GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('  - Google Client Secret:', GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  - GitHub Client ID:', GITHUB_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('  - GitHub Client Secret:', GITHUB_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  - Auth Secret:', AUTH_SECRET ? '✅ Set' : '❌ Missing');

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

  const session = await event.locals.auth();
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