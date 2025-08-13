// Email service with support for real email sending
// In production, you would use a real email service like SendGrid, AWS SES, etc.

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(data: EmailData): Promise<void> {
  // Check if SMTP is configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  
  if (smtpHost && smtpUser && smtpPass) {
    // Use real SMTP
    await sendEmailViaSMTP(data);
  } else {
    // For development, just log the email
    console.log('📧 EMAIL SENT (Development Mode):');
    console.log('To:', data.to);
    console.log('Subject:', data.subject);
    console.log('HTML Content:', data.html);
    console.log('---');
    console.log('💡 To send real emails, configure SMTP settings in your .env file');
    console.log('---');
  }
}

async function sendEmailViaSMTP(data: EmailData): Promise<void> {
  try {
    // Dynamic import to avoid bundling nodemailer in client
    const nodemailer = await import('nodemailer');
    
    // Use the correct environment variable names from your .env file
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.GMAIL_USER || process.env.SMTP_USER;
    const smtpPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    console.log('📧 Attempting to send email via SMTP...');
    console.log('SMTP Host:', smtpHost);
    console.log('SMTP Port:', smtpPort);
    console.log('SMTP User:', smtpUser);
    console.log('SMTP From:', smtpFrom);
    
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text,
    });

    console.log('📧 Real email sent successfully to:', data.to);
  } catch (error) {
    console.error('❌ Failed to send email via SMTP:', error);
    // Fallback to logging
    console.log('📧 EMAIL SENT (Fallback - SMTP failed):');
    console.log('To:', data.to);
    console.log('Subject:', data.subject);
    console.log('HTML Content:', data.html);
  }
}

export function createPasswordResetEmail(email: string, resetUrl: string): EmailData {
  return {
    to: email,
    subject: 'Reset Your Password - Auth App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reset Your Password</h2>
        <p>You requested a password reset for your account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Reset Password
        </a>
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
        </p>
      </div>
    `,
    text: `
Reset Your Password

You requested a password reset for your account.

Click this link to reset your password: ${resetUrl}

If you didn't request this password reset, you can safely ignore this email.

This link will expire in 1 hour.
    `
  };
}