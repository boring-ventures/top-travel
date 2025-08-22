import { NextRequest, NextResponse } from "next/server";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { cleanupOrphanedImages } from "@/lib/supabase/storage";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    console.log("Starting image cleanup process...");
    const result = await cleanupOrphanedImages();

    return NextResponse.json({
      success: true,
      message: "Image cleanup completed",
      result,
    });
  } catch (error) {
    console.error("Image cleanup error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Cleanup failed",
      },
      { status: 500 }
    );
  }
}
