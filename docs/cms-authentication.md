# CMS Authentication System

This document explains how the CMS authentication system works and how to implement proper security measures.

## Overview

The CMS (Content Management System) uses a multi-layered authentication approach to ensure only SUPERADMIN users can access and modify content.

## Authentication Layers

### 1. **Middleware Protection** (Primary)

- **File**: `src/middleware.ts`
- **Function**: Enforces SUPERADMIN role for all `/cms/*` routes
- **Behavior**: Redirects non-SUPERADMIN users to `/dashboard`

### 2. **Server-Side Layout Protection** (Secondary)

- **File**: `src/app/(dashboard)/cms/layout.tsx`
- **Function**: Additional server-side authentication check
- **Behavior**: Redirects unauthenticated users to `/sign-in` and non-SUPERADMIN users to `/dashboard`

### 3. **Client-Side Protection** (Tertiary)

- **File**: `src/components/admin/cms-auth-guard.tsx`
- **Function**: Client-side authentication guard for CMS components
- **Behavior**: Shows loading states and access denied messages

### 4. **API Route Protection** (Data Layer)

- **Files**: All `/api/*` routes
- **Function**: Ensures SUPERADMIN role for write operations
- **Behavior**: Returns 403 errors for unauthorized access

## Implementation Guide

### For CMS Pages

#### Option 1: Using the Auth Guard Component (Recommended)

```tsx
"use client";
import { CmsAuthGuard } from "@/components/admin/cms-auth-guard";

function MyCmsPageContent() {
  // Your CMS page content here
  return <div>CMS Content</div>;
}

export default function MyCmsPage() {
  return (
    <CmsAuthGuard>
      <MyCmsPageContent />
    </CmsAuthGuard>
  );
}
```

#### Option 2: Using the Auth Hook

```tsx
"use client";
import { useCmsAuth } from "@/hooks/use-cms-auth";
import { Loader } from "@/components/ui/loader";

export default function MyCmsPage() {
  const { isAuthorized, isLoading } = useCmsAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthorized) {
    return <div>Access Denied</div>;
  }

  return <div>CMS Content</div>;
}
```

### For API Routes

#### Write Operations (POST, PUT, DELETE, PATCH)

```tsx
import { auth, ensureSuperadmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    // Your API logic here
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Operation failed" },
      { status }
    );
  }
}
```

#### Read Operations (GET)

```tsx
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const isSuperadmin = session?.user?.role === "SUPERADMIN";

    // Filter data based on user role
    const where = {
      status: isSuperadmin ? undefined : "PUBLISHED",
      // Other filters...
    };

    // Your API logic here
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
```

## Security Best Practices

### 1. **Always Use Multiple Layers**

- Don't rely on just one authentication method
- Combine middleware, server-side, and client-side checks

### 2. **Validate on Both Client and Server**

- Client-side validation provides better UX
- Server-side validation ensures security

### 3. **Use Role-Based Data Filtering**

- Filter data based on user role
- Show draft content only to SUPERADMIN users

### 4. **Handle Errors Gracefully**

- Provide clear error messages
- Redirect users appropriately

### 5. **Log Authentication Events**

- Log failed authentication attempts
- Monitor for suspicious activity

## Testing Authentication

### Test Endpoints

1. **Check Authentication Status**:

   ```bash
   curl http://localhost:3000/api/test-auth
   ```

2. **Test SUPERADMIN Access**:

   ```bash
   curl -X POST http://localhost:3000/api/test-auth
   ```

3. **Check Role Information**:
   ```bash
   curl http://localhost:3000/api/check-role
   ```

### Manual Testing

1. **Test as Regular User**:

   - Sign in with a USER role account
   - Try to access `/cms/*` routes
   - Should be redirected to `/dashboard`

2. **Test as SUPERADMIN**:

   - Sign in with a SUPERADMIN role account
   - Access `/cms/*` routes
   - Should work normally

3. **Test Unauthenticated**:
   - Sign out
   - Try to access `/cms/*` routes
   - Should be redirected to `/sign-in`

## Troubleshooting

### Common Issues

1. **"Access Denied" on CMS Pages**:

   - Check if user has SUPERADMIN role
   - Verify `MOCK_SUPERADMIN=true` is set (development only)
   - Check browser console for errors

2. **API Returns 403**:

   - Verify user authentication
   - Check user role in database
   - Ensure `ensureSuperadmin()` is called

3. **Infinite Redirects**:
   - Check middleware configuration
   - Verify redirect paths are correct
   - Check for circular redirects

### Debug Steps

1. **Check User Role**:

   ```sql
   SELECT * FROM profiles WHERE "userId" = 'your-user-id';
   ```

2. **Test Authentication API**:

   ```bash
   curl http://localhost:3000/api/test-auth
   ```

3. **Check Environment Variables**:

   ```bash
   echo $MOCK_SUPERADMIN
   ```

4. **Review Server Logs**:
   - Look for authentication debug messages
   - Check for error logs

## Migration Guide

### Adding Authentication to New CMS Pages

1. **Wrap with Auth Guard**:

   ```tsx
   import { CmsAuthGuard } from "@/components/admin/cms-auth-guard";

   export default function NewCmsPage() {
     return (
       <CmsAuthGuard>
         <YourPageContent />
       </CmsAuthGuard>
     );
   }
   ```

2. **Add API Protection**:

   ```tsx
   import { auth, ensureSuperadmin } from "@/lib/auth";

   export async function POST(request: Request) {
     const session = await auth();
     ensureSuperadmin(session?.user);
     // Your API logic
   }
   ```

### Updating Existing Pages

1. **Add Auth Guard**:

   - Wrap existing content with `CmsAuthGuard`
   - Test authentication flow

2. **Update API Routes**:
   - Add `ensureSuperadmin()` calls
   - Implement role-based data filtering

## Security Checklist

- [ ] Middleware protects all `/cms/*` routes
- [ ] Server-side layout checks authentication
- [ ] Client-side components use auth guard
- [ ] API routes use `ensureSuperadmin()` for writes
- [ ] Data is filtered based on user role
- [ ] Error handling is implemented
- [ ] Authentication is tested thoroughly
- [ ] Environment variables are secure
- [ ] Logs are monitored for security events
