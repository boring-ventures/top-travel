import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Skip auth check for the auth callback route
  if (req.nextUrl.pathname.startsWith("/auth/callback")) {
    return res;
  }

  // If there's no user and the user is trying to access a protected route
  if (
    (userError || !user) &&
    (req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/cms"))
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a user and the user is trying to access auth routes
  if (
    user &&
    (req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up"))
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  // Enforce SUPERADMIN for CMS
  if (req.nextUrl.pathname.startsWith("/cms")) {
    if (userError || !user) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/sign-in";
      redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    // First try role on JWT if present
    const role = (user as any)?.role;
    if (role !== "SUPERADMIN") {
      // Fallback: fetch profile from our API and check role
      try {
        const profileUrl = new URL(`/api/profile/${user.id}`, req.url);
        const profileRes = await fetch(profileUrl.toString(), {
          headers: {
            // Pass through cookies so the API can authenticate the user
            cookie: req.headers.get("cookie") ?? "",
          },
        });
        if (profileRes.ok) {
          const { profile } = (await profileRes.json()) as {
            profile?: { role?: string };
          };
          if (profile?.role !== "SUPERADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
          }
        } else {
          // If we cannot verify, deny access by default
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cms/:path*",
    "/sign-in",
    "/sign-up",
    "/auth/callback",
  ],
};
