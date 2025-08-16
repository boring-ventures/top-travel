import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
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

    // Direct database query to check user's role
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    console.log("Test offer update - User profile:", {
      userId,
      email: session.user.email,
      role: profile?.role,
      profileExists: !!profile,
    });

    // Check if user has SUPERADMIN role
    if (!profile || profile.role !== "SUPERADMIN") {
      return NextResponse.json(
        {
          error: "Forbidden: requires SUPERADMIN role",
          userRole: profile?.role || "NO_PROFILE",
          profileExists: !!profile,
        },
        { status: 403 }
      );
    }

    // If we get here, user has SUPERADMIN role
    const body = await request.json();
    const { offerId, updateData } = body;

    if (!offerId) {
      return NextResponse.json(
        { error: "Offer ID is required" },
        { status: 400 }
      );
    }

    // Try to update the offer
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Offer updated successfully",
      offer: updatedOffer,
      userRole: profile.role,
    });
  } catch (error: any) {
    console.error("Error in test offer update:", error);
    return NextResponse.json(
      { error: "Failed to update offer", details: error.message },
      { status: 500 }
    );
  }
}
