import dotenv from 'dotenv';
import { sendEmail, createPasswordResetEmail } from './src/lib/server/services/email-service.ts';

// Load environment variables
dotenv.config();

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('Environment variables:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '***' : 'NOT SET');
  console.log('SMTP_FROM:', process.env.SMTP_FROM);
  console.log('AUTH_URL:', process.env.AUTH_URL);

  try {
    const testEmail = createPasswordResetEmail(
      'test@example.com', 
      'http://localhost:5183/reset-password?token=test&email=test@example.com'
    );
    
    console.log('\nAttempting to send test email...');
    await sendEmail(testEmail);
    console.log('✅ Email test completed');
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
}

testEmail();
