import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  formatShortDate,
  calculateDuration,
  formatDuration,
} from "@/lib/date-utils";

interface FixedDeparture {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  endDate: Date;
}

interface FixedDeparturesListProps {
  title: string;
  departures: FixedDeparture[];
  showViewAllButton?: boolean;
  viewAllHref?: string;
  className?: string;
}

export function FixedDeparturesList({
  title,
  departures,
  showViewAllButton = true,
  viewAllHref,
  className,
}: FixedDeparturesListProps) {
  return (
    <div className={`space-y-6 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">{title}</h3>
        {showViewAllButton && viewAllHref && (
          <Button asChild variant="outline">
            <Link href={viewAllHref}>Ver todas</Link>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {departures.map((departure) => {
          const duration = calculateDuration(
            departure.startDate,
            departure.endDate
          );

          return (
            <Card
              key={departure.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <Link
                href={`/fixed-departures/${departure.slug}`}
                className="block"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg mb-1">
                      {departure.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {formatShortDate(departure.startDate)} -{" "}
                        {formatShortDate(departure.endDate)}
                      </span>
                      <span>{formatDuration(duration)}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver detalles
                  </Button>
                </div>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

