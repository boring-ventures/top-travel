import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  // Get user profile
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      avatarUrl: true,
    },
  });

  // If no profile exists, create one
  if (!profile) {
    const mockSuperadmin = process.env.MOCK_SUPERADMIN === "true";
    const defaultRole = mockSuperadmin ? "SUPERADMIN" : "USER";

    await prisma.profile.create({
      data: {
        userId,
        firstName: null,
        lastName: null,
        avatarUrl: null,
        active: true,
        role: defaultRole,
      },
    });

    // Redirect to refresh the page with the new profile
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Welcome</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {profile.firstName || session.user.email}
            </div>
            <p className="text-xs text-muted-foreground">
              Role: {profile.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
