import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get the current user's session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // Raw database query to check all profiles
    const allProfiles = await prisma.profile.findMany({
      select: {
        id: true,
        userId: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Find the current user's profile
    const currentUserProfile = allProfiles.find((p) => p.userId === userId);

    // Also try a direct query for the current user
    const directQuery = await prisma.profile.findUnique({
      where: { userId },
    });

    return NextResponse.json({
      userId: session.user.id,
      email: session.user.email,
      allProfiles: allProfiles,
      currentUserProfile: currentUserProfile,
      directQuery: directQuery,
      profileCount: allProfiles.length,
      currentUserExists: !!currentUserProfile,
      directQueryExists: !!directQuery,
    });
  } catch (error) {
    console.error("Error in db check:", error);
    return NextResponse.json(
      { error: "Failed to check database", details: error },
      { status: 500 }
    );
  }
}
