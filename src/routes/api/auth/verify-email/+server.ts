import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { verificationTokens, users } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
  const { email, token } = await request.json();
  if (!email || !token) {
    return json({ message: 'Missing required fields' }, { status: 400 });
  }

  // Find token
  const record = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.identifier, email),
      eq(verificationTokens.token, token)
    )
  });
  if (!record || new Date(record.expiresAt) < new Date()) {
    return json({ message: 'Invalid or expired token' }, { status: 400 });
  }

  // Update user
  const [updatedUser] = await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, email))
    .returning();
  if (!updatedUser) {
    return json({ message: 'User not found' }, { status: 404 });
  }

  // Delete token
  await db.delete(verificationTokens).where(
    and(
      eq(verificationTokens.identifier, email),
      eq(verificationTokens.token, token)
    )
  );

  return json({ message: 'Email verified successfully.' });
};