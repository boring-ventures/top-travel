import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
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
    const supabase = createRouteHandlerClient({
      cookies: () => Promise.resolve(cookieStore),
    });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return null;

    // Lookup role from our Profile table; default to USER if missing
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true },
    });

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        role: (profile?.role as User["role"]) ?? "USER",
      },
    };
  } catch (e) {
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
