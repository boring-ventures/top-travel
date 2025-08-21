import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface QuickInfoItem {
  label: string;
  value: string | number | React.ReactNode;
}

interface QuickInfoCardProps {
  title: string;
  items: QuickInfoItem[];
  className?: string;
}

export function QuickInfoCard({ title, items, className }: QuickInfoCardProps) {
  return (
    <Card className={`p-6 ${className || ""}`}>
      <h4 className="font-semibold mb-4">{title}</h4>
      <div className="space-y-3 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-muted-foreground">{item.label}:</span>
            <span className="font-medium">
              {typeof item.value === "string" &&
              item.value.includes("Destacado") ? (
                <Badge className="bg-yellow-500 text-white text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Destacado
                </Badge>
              ) : (
                item.value
              )}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

