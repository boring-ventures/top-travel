import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

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
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get current profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      profile: profile,
      session: {
        accessToken: session.access_token ? "Present" : "Missing",
        refreshToken: session.refresh_token ? "Present" : "Missing",
      },
    });
  } catch (error) {
    console.error("Error getting debug info:", error);
    return NextResponse.json(
      { error: "Failed to get debug info" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const cookieStore = await cookies();
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

    // Update the user's role to SUPERADMIN
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: { role: "SUPERADMIN" },
    });

    return NextResponse.json({
      message: "Role updated to SUPERADMIN",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
