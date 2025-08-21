import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <Card className={`p-6 sm:p-8 ${className || ""}`}>
      <div className="text-center py-8 text-muted-foreground">
        <Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {description && <p>{description}</p>}
      </div>
    </Card>
  );
}

