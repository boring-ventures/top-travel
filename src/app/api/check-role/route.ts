import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get current profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { role: true },
    });

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      role: profile?.role || "USER",
      profileExists: !!profile,
    });
  } catch (error) {
    console.error("Error checking role:", error);
    return NextResponse.json(
      { error: "Failed to check role" },
      { status: 500 }
    );
  }
}
