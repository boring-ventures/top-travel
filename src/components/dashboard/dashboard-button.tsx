"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardButtonProps {
  className?: string;
}

export default function DashboardButton({
  className,
}: DashboardButtonProps = {}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleClick = () => {
    try {
      console.log("Dashboard button clicked, navigating to dashboard");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error navigating to dashboard:", error);
      // Fallback navigation
      window.location.href = "/dashboard";
    }
  };

  // Debug logging to help identify issues
  React.useEffect(() => {
    if (user) {
      console.log("Dashboard button rendered for user:", user.email);
    }
  }, [user]);

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full shadow-lg",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "transition-all duration-200 hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      size="icon"
      type="button"
      aria-label="Go to Dashboard"
    >
      <LayoutDashboard className="h-5 w-5" />
    </Button>
  );
}
