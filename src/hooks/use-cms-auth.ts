"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { UserRole } from "@prisma/client";

export function useCmsAuth() {
  const { profile, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!profile) {
        // No profile means not authenticated
        router.push("/sign-in");
        return;
      }

      if (profile.role !== UserRole.SUPERADMIN) {
        // Not a SUPERADMIN, redirect to dashboard
        router.push("/dashboard");
        return;
      }

      // User is authenticated and has SUPERADMIN role
      setIsAuthorized(true);
    }
  }, [profile, isLoading, router]);

  return {
    isAuthorized,
    isLoading,
    profile,
    isSuperAdmin: profile?.role === UserRole.SUPERADMIN,
  };
}

