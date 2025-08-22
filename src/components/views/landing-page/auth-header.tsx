"use client";

import { useAuth } from "@/providers/auth-provider";
import DashboardButton from "@/components/dashboard/dashboard-button";
import Link from "next/link";

export function AuthHeader() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-9 w-[100px] animate-pulse rounded-md bg-muted" />;
  }

  if (user) {
    return <DashboardButton />;
  }

  return (
    <div className="flex items-center">
      <Link
        href="/sign-in"
        className="bg-white text-black px-4 py-2 rounded-md hover:bg-white/90 transition-colors"
      >
        Sign In
      </Link>
    </div>
  );
}
