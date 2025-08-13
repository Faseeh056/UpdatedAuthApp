import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, verificationTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { sendEmail, createPasswordResetEmail } from '$lib/server/services/email-service';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Hash the reset token for storage
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Clean up old tokens for this email first
    await db.delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email));

    // Store reset token in database
    await db.insert(verificationTokens).values({
      identifier: email,
      token: hashedToken,
      expires: resetTokenExpiry
    });

    // Create reset URL - use localhost:5174 if AUTH_URL is not set
    const baseUrl = process.env.AUTH_URL || 'http://localhost:5174';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    console.log('🔗 Generated reset URL:', resetUrl);

    // Send password reset email
    const emailData = createPasswordResetEmail(email, resetUrl);
    await sendEmail(emailData);

    // Log the reset URL for easy testing
    console.log('🔗 RESET LINK FOR TESTING:', resetUrl);

    // In development, return the reset URL for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return json({ 
      message: 'If an account with that email exists, a password reset link has been sent.',
      ...(isDevelopment && { resetUrl })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}