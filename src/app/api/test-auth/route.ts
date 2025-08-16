import { NextRequest, NextResponse } from "next/server";
import { auth, ensureSuperadmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        {
          error: "Not authenticated",
          mockSuperadmin: process.env.MOCK_SUPERADMIN,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: session.user,
      mockSuperadmin: process.env.MOCK_SUPERADMIN,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json(
      {
        error: "Auth test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        mockSuperadmin: process.env.MOCK_SUPERADMIN,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Test SUPERADMIN access
    ensureSuperadmin(session.user);

    return NextResponse.json({
      message: "SUPERADMIN access confirmed",
      user: session.user,
      mockSuperadmin: process.env.MOCK_SUPERADMIN,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("SUPERADMIN test error:", error);
    return NextResponse.json(
      {
        error: "SUPERADMIN access denied",
        details: error instanceof Error ? error.message : "Unknown error",
        mockSuperadmin: process.env.MOCK_SUPERADMIN,
      },
      { status: 403 }
    );
  }
}
