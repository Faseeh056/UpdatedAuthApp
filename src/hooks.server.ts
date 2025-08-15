import { sequence } from '@sveltejs/kit/hooks';
import { authHandle, protectHandle } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

/**
 * Content Security Policy (CSP) Handler
 * Implements secure CSP with development mode support
 */
const cspHandle: Handle = async ({ event, resolve }) => {
  try {
    // Base CSP directives - secure by default
    const cspDirectives = [
      // Default source restrictions
      "default-src 'self'",
      
      // Script sources - allow unsafe-eval only in development
      dev 
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self' 'unsafe-inline'",
      
      // Style sources
      "style-src 'self' 'unsafe-inline'",
      
      // Image sources - allow OAuth provider images and data URIs
      "img-src 'self' data: https: blob: https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
      
      // Font sources
      "font-src 'self' data: https:",
      
      // Connect sources - allow OAuth endpoints and API calls
      "connect-src 'self' https://accounts.google.com https://github.com https://api.github.com https://api.openai.com",
      
      // Frame sources - allow OAuth popups
      "frame-src 'self' https://accounts.google.com https://github.com",
      
      // Form actions
      "form-action 'self'",
      
      // Base URI
      "base-uri 'self'",
      
      // Object sources - block potentially dangerous content
      "object-src 'none'",
      
      // Media sources
      "media-src 'self'",
      
      // Upgrade insecure requests in production
      ...(dev ? [] : ["upgrade-insecure-requests"])
    ];

    // Set comprehensive security headers
    event.setHeaders({
      // Content Security Policy
      'Content-Security-Policy': cspDirectives.join('; '),
      
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      
      // Referrer policy for privacy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Prevent XSS attacks (additional layer)
      'X-XSS-Protection': '1; mode=block',
      
      // Strict transport security in production
      ...(dev ? {} : { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' })
    });

    // Log CSP mode for debugging
    if (dev) {
      console.log('🔧 Development mode: unsafe-eval enabled for debugging');
    } else {
      console.log('🚀 Production mode: Strict CSP enabled (no unsafe-eval)');
    }

    const response = await resolve(event);
    return response;
  } catch (error) {
    console.error('❌ Error in CSP handle:', error);
    // Fallback to basic response if CSP setup fails
    return resolve(event);
  }
};

/**
 * Error Handling and Logging Handler
 * Provides centralized error handling and request logging
 */
const errorHandlingHandle: Handle = async ({ event, resolve }) => {
  const startTime = Date.now();
  
  try {
    const response = await resolve(event);
    
    // Log successful requests in development
    if (dev) {
      const duration = Date.now() - startTime;
      console.log(`✅ ${event.request.method} ${event.url.pathname} - ${response.status} (${duration}ms)`);
    }
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Log errors with context
    console.error(`❌ Error handling ${event.request.method} ${event.url.pathname}:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration,
      timestamp: new Date().toISOString()
    });

    // Re-throw the error to let SvelteKit handle it
    throw error;
  }
};

// Combine all handles using sequence for proper execution order
export const handle = sequence(
  cspHandle,           // 1. Set security headers and CSP
  authHandle.handle,   // 2. Handle authentication (OAuth + local)
  protectHandle,       // 3. Route protection from auth.ts (includes redirects)
  errorHandlingHandle  // 4. Error handling and logging
);