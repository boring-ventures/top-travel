import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import prisma from "@/lib/prisma";

interface User {
  id: string;
  email?: string | null;
  role?: "USER" | "SUPERADMIN";
}

interface Session {
  user: User;
}

// Server-side auth using Supabase session and Prisma profile role
export async function auth(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return null;

    // Lookup role from our Profile table; create profile if missing
    let profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true },
    });

    console.log("Auth debug:", {
      userId: session.user.id,
      email: session.user.email,
      profileRole: profile?.role,
      profileExists: !!profile,
      timestamp: new Date().toISOString(),
    });

    // If profile doesn't exist, create a default one with SUPERADMIN role
    if (!profile) {
      const newProfile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          firstName: null,
          lastName: null,
          avatarUrl: null,
          active: true,
          role: "SUPERADMIN",
        },
        select: { role: true },
      });
      profile = newProfile;
      console.log("Created new profile with role:", newProfile.role);
    }

    const userRole = (profile?.role as User["role"]) ?? "SUPERADMIN";
    console.log("Final user role:", userRole);

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        role: userRole,
      },
    };
  } catch (e) {
    console.error("Auth error:", e);
    return null;
  }
}

export function ensureSuperadmin(user?: User) {
  if (!user || user.role !== "SUPERADMIN") {
    const error = new Error("Forbidden: requires SUPERADMIN role");
    // @ts-ignore attach status code
    error.status = 403;
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  return session?.user ?? null;
}
