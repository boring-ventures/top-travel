import { NextRequest, NextResponse } from "next/server";
import { auth, ensureSuperadmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: "desc" },
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

    // Get user emails from Supabase Auth
    const profilesWithEmails = await Promise.all(
      profiles.map(async (profile) => {
        try {
          const { data: user } = await supabaseAdmin.auth.admin.getUserById(
            profile.userId
          );
          return {
            ...profile,
            email: user.user?.email || null,
          };
        } catch (error) {
          console.error(`Failed to get email for user ${profile.userId}:`, error);
          return {
            ...profile,
            email: null,
          };
        }
      })
    );

    return NextResponse.json(profilesWithEmails);
  } catch (error) {
    console.error("GET /api/users - Error:", error);
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json(
        { error: `Failed to create user: ${authError.message}` },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // Create profile in our database
    const profile = await prisma.profile.create({
      data: {
        userId,
        firstName: firstName || null,
        lastName: lastName || null,
        avatarUrl: null,
        active: true,
        role: "SUPERADMIN",
      },
    });

    return NextResponse.json({
      userId: profile.userId,
      email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.role,
      active: profile.active,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users - Error:", error);
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: "Failed to create user" },
      { status }
    );
  }
}