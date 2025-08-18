import { ReactNode } from "react";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { redirect } from "next/navigation";

// Force dynamic rendering for CMS pages
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CmsLayout({ children }: { children: ReactNode }) {
  // Server-side authentication check
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  try {
    // Ensure user has SUPERADMIN role
    ensureSuperadmin(session.user);
  } catch (error) {
    // If user doesn't have SUPERADMIN role, redirect to dashboard
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8 md:py-10">
      <main className="flex-1 space-y-6">{children}</main>
    </div>
  );
}
