import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, verificationTokens } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { token, email, password } = await request.json();

    console.log('🔐 Reset password request:', { email, tokenLength: token?.length });

    if (!token || !email || !password) {
      return json({ error: 'Token, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Get all tokens for this email and find the most recent one
    const allTokens = await db.query.verificationTokens.findMany({
      where: eq(verificationTokens.identifier, email),
      orderBy: (tokens, { desc }) => [desc(tokens.expires)]
    });
    console.log('🔍 Total tokens for email:', allTokens.length);

    // Get the most recent token
    const verificationToken = allTokens[0];
    console.log('🔍 Found verification token:', !!verificationToken);
    console.log('🔍 Token from URL:', token.substring(0, 10) + '...');
    console.log('🔍 Stored token hash:', verificationToken?.token?.substring(0, 10) + '...');

    if (!verificationToken) {
      return json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Verify the token
    const isValidToken = await bcrypt.compare(token, verificationToken.token);
    console.log('🔐 Token verification result:', isValidToken);
    
    if (!isValidToken) {
      return json({ error: 'Invalid reset token' }, { status: 400 });
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      return json({ error: 'Reset token has expired' }, { status: 400 });
    }

    // Find the user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await db.update(users)
      .set({ 
        password: hashedPassword
      })
      .where(eq(users.email, email));

    // Delete all tokens for this email (cleanup)
    await db.delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email));

    return json({ 
      message: 'Password reset successfully' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};