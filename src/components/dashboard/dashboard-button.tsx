"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardButtonProps {
  className?: string;
  variant?: "default" | "pink" | "gold" | "wine" | "black" | "blue";
}

export default function DashboardButton({
  className,
  variant = "default",
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

  const getVariantStyles = () => {
    switch (variant) {
      case "pink":
        return "bg-[#e03d90] text-white hover:bg-[#c8327a] shadow-pink-200/50 focus:ring-pink-500";
      case "gold":
        return "bg-[#eaa298] text-white hover:bg-[#eaa298]/80 shadow-[#eaa298]/50 focus:ring-[#eaa298]";
      case "wine":
        return "bg-wine text-white hover:bg-wine-light shadow-wine/50 focus:ring-wine";
      case "black":
        return "bg-black text-white hover:bg-gray-800 shadow-black/50 focus:ring-black";
      case "blue":
        return "bg-corporate-blue text-white hover:bg-corporate-blue/90 shadow-blue-200/50 focus:ring-corporate-blue";
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary";
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full shadow-lg",
        "transition-all duration-200 hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        getVariantStyles(),
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
