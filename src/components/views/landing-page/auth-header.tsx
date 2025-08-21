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
    <div className="flex items-center space-x-4">
      <Link
        href="/sign-in"
        className="text-white hover:text-white/80 hover:bg-white/10 px-4 py-2 rounded-md transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className="bg-white text-black px-4 py-2 rounded-md hover:bg-white/90 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
