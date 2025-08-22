import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
  className?: string;
}

export function BackButton({ href, label, className }: BackButtonProps) {
  return (
    <Button
      asChild
      variant="secondary"
      size="sm"
      className={`backdrop-blur-sm bg-background/80 ${className || ""}`}
    >
      <Link href={href}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {label}
      </Link>
    </Button>
  );
}

