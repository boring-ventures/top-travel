import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface FeaturedBadgeProps {
  className?: string;
}

export function FeaturedBadge({ className }: FeaturedBadgeProps) {
  return (
    <Badge
      className={`bg-yellow-500 text-white border-yellow-500 ${className || ""}`}
    >
      <Star className="h-3 w-3 mr-1" />
      Destacado
    </Badge>
  );
}

