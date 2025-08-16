import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({
      cookies: async () => cookieStore,
    });

    // Get the current user's session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if current user is SUPERADMIN
    const currentUserProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (currentUserProfile?.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Only SUPERADMIN can manage roles" },
        { status: 403 }
      );
    }

    const { targetUserId, newRole } = await request.json();

    if (!targetUserId || !newRole) {
      return NextResponse.json(
        { error: "targetUserId and newRole are required" },
        { status: 400 }
      );
    }

    if (!Object.values(UserRole).includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be USER or SUPERADMIN" },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetProfile = await prisma.profile.findUnique({
      where: { userId: targetUserId },
    });

    if (!targetProfile) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    // Update the role
    const updatedProfile = await prisma.profile.update({
      where: { userId: targetUserId },
      data: { role: newRole },
    });

    return NextResponse.json({
      message: `User role updated to ${newRole}`,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
