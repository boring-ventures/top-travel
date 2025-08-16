import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Create user profile in Prisma if it doesn't exist and we have a session
    if (data?.session) {
      const userId = data.session.user.id;

      const existingProfile = await prisma.profile.findUnique({
        where: { userId },
      });

      if (!existingProfile) {
        // Check if MOCK_SUPERADMIN is enabled for local development
        const mockSuperadmin = process.env.MOCK_SUPERADMIN === "true";
        const defaultRole = mockSuperadmin
          ? UserRole.SUPERADMIN
          : UserRole.USER;

        await prisma.profile.create({
          data: {
            userId,
            role: defaultRole,
          },
        });

        console.log(
          `Created new profile with role: ${defaultRole} (MOCK_SUPERADMIN: ${mockSuperadmin})`
        );
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
