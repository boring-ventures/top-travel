import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

interface PriceDisplayProps {
  price?: number;
  currency?: string;
  isCustom?: boolean;
  showFrom?: boolean;
  className?: string;
}

export function PriceDisplay({
  price,
  currency = "USD",
  isCustom = false,
  showFrom = true,
  className,
}: PriceDisplayProps) {
  if (isCustom) {
    return (
      <div className={`flex items-center gap-2 ${className || ""}`}>
        <DollarSign className="h-4 w-4" />
        <span className="font-semibold">
          Paquete personalizado - Consulta precios
        </span>
      </div>
    );
  }

  if (!price) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <DollarSign className="h-4 w-4" />
      <span className="font-semibold">
        {showFrom ? "Desde " : ""}
        {currency} {price.toString()}
      </span>
    </div>
  );
}

interface PriceBadgeProps {
  price?: number;
  currency?: string;
  isCustom?: boolean;
  className?: string;
}

export function PriceBadge({
  price,
  currency = "USD",
  isCustom = false,
  className,
}: PriceBadgeProps) {
  if (isCustom || !price) {
    return null;
  }

  return (
    <Badge
      className={`bg-white/90 text-black hover:bg-white text-xs ${className || ""}`}
    >
      Desde ${price.toString()}
    </Badge>
  );
}

