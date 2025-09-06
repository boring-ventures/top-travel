import { NextRequest, NextResponse } from "next/server";
import { auth, ensureSuperadmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    const { id } = await params;

    const profile = await prisma.profile.findUnique({
      where: { userId: id },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        active: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user email from Supabase Auth
    let email = null;
    try {
      const { data: user } = await supabaseAdmin.auth.admin.getUserById(id);
      email = user.user?.email || null;
    } catch (error) {
      console.error(`Failed to get email for user ${id}:`, error);
    }

    return NextResponse.json({
      ...profile,
      email,
    });
  } catch (error) {
    console.error("GET /api/users/[id] - Error:", error);
    const status = (error as any)?.status ?? 500;
    return NextResponse.json({ error: "Failed to fetch user" }, { status });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, active } = body;

    const profile = await prisma.profile.update({
      where: { userId: id },
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        active: active ?? true,
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        active: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get user email from Supabase Auth
    let email = null;
    try {
      const { data: user } = await supabaseAdmin.auth.admin.getUserById(id);
      email = user.user?.email || null;
    } catch (error) {
      console.error(`Failed to get email for user ${id}:`, error);
    }

    return NextResponse.json({
      ...profile,
      email,
    });
  } catch (error) {
    console.error("PATCH /api/users/[id] - Error:", error);
    const status = (error as any)?.status ?? 500;
    return NextResponse.json({ error: "Failed to update user" }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    const { id } = await params;

    // Check if user exists
    const profile = await prisma.profile.findUnique({
      where: { userId: id },
    });

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user from our database first
    await prisma.profile.delete({
      where: { userId: id },
    });

    // Delete user from Supabase Auth
    try {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (error) {
        console.error(
          `Failed to delete user from Supabase Auth: ${error.message}`
        );
        // We don't throw here because we've already deleted from our database
        // This could be a case where the user was already deleted from Supabase but not from our DB
      }
    } catch (error) {
      console.error(`Error deleting user from Supabase Auth:`, error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/users/[id] - Error:", error);
    const status = (error as any)?.status ?? 500;
    return NextResponse.json({ error: "Failed to delete user" }, { status });
  }
}
