# Authentication Setup Guide

This document explains how the authentication system works and how to set up SUPERADMIN access for the application.

## Overview

The application uses a dual authentication system:

1. **Supabase Auth** - Handles user authentication (sign up, sign in, password reset)
2. **Prisma Profile** - Stores user roles and additional profile information

## User Roles

There are two user roles defined in the system:

- **USER** - Regular users with basic access
- **SUPERADMIN** - Administrative users with full access to CMS and admin features

## Setting Up SUPERADMIN Access

### Method 1: Local Development (Recommended)

For local development, you can automatically assign SUPERADMIN role to all new users:

1. Add the following environment variable to your `.env.local` file:

   ```
   MOCK_SUPERADMIN=true
   ```

2. Restart your development server

3. Sign up or sign in with any account - it will automatically be assigned SUPERADMIN role

**⚠️ Important**: Never set `MOCK_SUPERADMIN=true` in production!

### Method 2: Production (Manual Role Assignment)

For production environments, you need to manually promote users to SUPERADMIN:

1. **Using the Admin Panel** (if you already have a SUPERADMIN):

   - Sign in as an existing SUPERADMIN user
   - Navigate to `/admin`
   - Use the Role Management tool to promote other users

2. **Using the API directly**:

   ```bash
   curl -X POST http://localhost:3000/api/fix-role \
     -H "Content-Type: application/json" \
     -H "Cookie: your-session-cookie" \
     -d '{"targetUserId": "user-id-here", "newRole": "SUPERADMIN"}'
   ```

3. **Using the Database directly** (emergency only):
   ```sql
   UPDATE profiles SET role = 'SUPERADMIN' WHERE "userId" = 'your-user-id';
   ```

## How It Works

### Authentication Flow

1. User signs up/signs in through Supabase Auth
2. Auth callback creates a profile in Prisma with default role (USER or SUPERADMIN based on MOCK_SUPERADMIN setting)
3. Middleware checks user role for protected routes
4. API routes use `ensureSuperadmin()` function to verify SUPERADMIN access

### Key Files

- `src/lib/auth.ts` - Core authentication logic and role management
- `src/middleware.ts` - Route protection and role enforcement
- `src/app/auth/callback/route.ts` - Profile creation during authentication
- `src/app/api/fix-role/route.ts` - Role management API
- `src/components/sidebar/dynamic-sidebar.tsx` - Dynamic navigation based on user role

### Testing Authentication

You can test the authentication system using these endpoints:

- `GET /api/test-auth` - Check current user authentication status
- `POST /api/test-auth` - Test SUPERADMIN access
- `GET /api/profile` - Get current user profile
- `POST /api/fix-role` - Update user roles (SUPERADMIN only)

## Security Considerations

1. **Environment Variables**: Never commit `.env` files with sensitive data
2. **MOCK_SUPERADMIN**: Only use in development, never in production
3. **Role Validation**: Always validate roles on both client and server side
4. **Session Management**: Sessions are managed by Supabase with automatic expiration
5. **API Protection**: All admin routes are protected by role checks

## Troubleshooting

### Common Issues

1. **"Not authenticated" error**:

   - Check if user is signed in
   - Verify Supabase configuration
   - Check browser cookies

2. **"SUPERADMIN access denied" error**:

   - Verify user has SUPERADMIN role in database
   - Check if MOCK_SUPERADMIN is set correctly
   - Ensure profile exists for the user

3. **CMS access denied**:
   - Verify user has SUPERADMIN role
   - Check middleware configuration
   - Ensure proper session handling

### Debug Steps

1. Check user profile in database:

   ```sql
   SELECT * FROM profiles WHERE "userId" = 'your-user-id';
   ```

2. Test authentication API:

   ```bash
   curl http://localhost:3000/api/test-auth
   ```

3. Check environment variables:

   ```bash
   echo $MOCK_SUPERADMIN
   ```

4. Review server logs for authentication debug messages

## Migration from Previous Versions

If you're upgrading from a previous version:

1. Ensure all existing users have profiles in the database
2. Update any hardcoded role checks to use the new system
3. Test authentication flow with existing users
4. Verify CMS access works for SUPERADMIN users
