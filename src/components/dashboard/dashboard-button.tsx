"use client";

import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardButtonProps {
  className?: string;
}

export default function DashboardButton({
  className,
}: DashboardButtonProps = {}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading || !user) return null;

  return (
    <Button
      onClick={() => router.push("/dashboard")}
      className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${className}`}
      size="icon"
    >
      <LayoutDashboard className="h-5 w-5" />
    </Button>
  );
}
