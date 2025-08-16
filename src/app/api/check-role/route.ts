import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get the current user's session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        {
          authenticated: false,
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Method 1: Direct database query
    const directProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    // Method 2: Using auth() function
    const authSession = await auth();

    return NextResponse.json({
      authenticated: true,
      userId: session.user.id,
      email: session.user.email,

      // Direct database query results
      directQuery: {
        role: directProfile?.role || "NO_PROFILE",
        profileExists: !!directProfile,
        profile: directProfile,
      },

      // Auth function results
      authFunction: {
        role: authSession?.user?.role || "NO_ROLE",
        user: authSession?.user,
      },

      // Comparison
      rolesMatch: directProfile?.role === authSession?.user?.role,
      session: {
        accessToken: session.access_token ? "Present" : "Missing",
        refreshToken: session.refresh_token ? "Present" : "Missing",
      },
    });
  } catch (error) {
    console.error("Error in check role:", error);
    return NextResponse.json(
      { error: "Failed to check role", details: error },
      { status: 500 }
    );
  }
}
