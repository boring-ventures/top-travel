import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Skip auth check for the auth callback route
  if (req.nextUrl.pathname.startsWith("/auth/callback")) {
    return res;
  }

  // If there's no session and the user is trying to access a protected route
  if (
    !session &&
    (req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/cms"))
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a session and the user is trying to access auth routes
  if (
    session &&
    (req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up"))
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  // Enforce SUPERADMIN for CMS
  if (req.nextUrl.pathname.startsWith("/cms")) {
    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/sign-in";
      redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    // First try role on JWT if present
    const role = (session.user as any)?.role;
    if (role !== "SUPERADMIN") {
      // Fallback: fetch profile from our API and check role
      try {
        const profileUrl = new URL(`/api/profile/${session.user.id}`, req.url);
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
