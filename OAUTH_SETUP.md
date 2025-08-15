# OAuth Setup Guide

## Prerequisites

1. **Environment Variables**: Create a `.env` file in your project root
2. **Database**: Ensure PostgreSQL is running and accessible
3. **OAuth Apps**: Set up OAuth applications in Google and GitHub

## Environment Variables

Create a `.env` file with the following variables:

```env
# Authentication Secret (generate with: openssl rand -base64 32)
AUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Environment
NODE_ENV=development
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback/google` (development)
   - `https://yourdomain.com/auth/callback/google` (production)
7. Copy Client ID and Client Secret to your `.env` file

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in application details:
   - Application name: Your app name
   - Homepage URL: `http://localhost:5173` (development)
   - Authorization callback URL: `http://localhost:5173/auth/callback/github`
4. Click "Register application"
5. Copy Client ID and Client Secret to your `.env` file

## Testing OAuth

1. **Start your development server**: `npm run dev`
2. **Go to login page**: `http://localhost:5173/login`
3. **Test Google OAuth**: Click "Continue with Google"
4. **Test GitHub OAuth**: Click "Continue with GitHub"
5. **Verify redirects**: Should go to `/dashboard` after successful auth

## Troubleshooting

### "Configuration" Error
- Check that all environment variables are set in `.env`
- Ensure `.env` file is in project root
- Restart development server after adding `.env`

### OAuth Callback Issues
- Verify redirect URIs match exactly in OAuth app settings
- Check browser console for error messages
- Check server console for debug logs

### Database Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correct
- Check database permissions

## Security Notes

- **Never commit `.env` file** to version control
- **Use strong AUTH_SECRET** (32+ characters)
- **Restrict OAuth redirect URIs** to your domains only
- **Enable HTTPS in production**

## Production Deployment

1. Set `NODE_ENV=production` in production environment
2. Use HTTPS URLs for OAuth redirects
3. Ensure all environment variables are set
4. Test OAuth flow in production environment
