import { MapPin } from "lucide-react";

interface LocationDisplayProps {
  city?: string;
  country?: string;
  venue?: string;
  showIcon?: boolean;
  className?: string;
}

export function LocationDisplay({
  city,
  country,
  venue,
  showIcon = true,
  className,
}: LocationDisplayProps) {
  if (!city && !country) {
    return (
      <div
        className={`flex items-center gap-2 text-muted-foreground ${className || ""}`}
      >
        {showIcon && <MapPin className="h-4 w-4" />}
        <span>Ubicación por confirmar</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {showIcon && <MapPin className="h-4 w-4" />}
      <span>
        {city || ""}, {country || ""}
        {venue && ` · ${venue}`}
      </span>
    </div>
  );
}

interface LocationBadgeProps {
  city: string;
  country: string;
  className?: string;
}

export function LocationBadge({
  city,
  country,
  className,
}: LocationBadgeProps) {
  return (
    <div
      className={`flex items-center gap-1 text-xs text-muted-foreground ${className || ""}`}
    >
      <MapPin className="h-3 w-3" />
      <span>
        {city}, {country}
      </span>
    </div>
  );
}

