import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { userService } from '$lib/server/services/user-service';
import { db } from '$lib/server/db';
import { verificationTokens } from '$lib/server/db/schema';
import { sendEmail } from '$lib/server/services/email-service';
import { v4 as uuidv4 } from 'uuid';

export const POST: RequestHandler = async ({ request }) => {
  const { email } = await request.json();
  if (!email) {
    return json({ message: 'Email is required' }, { status: 400 });
  }

  const user = await userService.getUserByEmail(email);
  if (!user) {
    return json({ message: 'User not found' }, { status: 404 });
  }

  // Generate token and expiry (24 hours)
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Store token
  await db.insert(verificationTokens).values({
    identifier: email,
    token,
    expiresAt,
  });

  // Send email
  const verifyUrl = `${process.env.BASE_URL || 'http://localhost:5173'}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  await sendEmail({
    to: email,
    subject: 'Verify your email address',
    html: `<p>Thank you for registering. <a href="${verifyUrl}">Click here to verify your email address</a>.</p>`
  });

  return json({ message: 'Verification email sent.' });
};