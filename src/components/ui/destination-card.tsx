import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

interface DestinationCardProps {
  destination: {
    id: string;
    city: string;
    country: string;
    slug: string;
    description?: string;
    heroImageUrl?: string;
    isFeatured?: boolean;
  };
  showDescription?: boolean;
  showFeaturedBadge?: boolean;
  className?: string;
}

export function DestinationCard({
  destination,
  showDescription = true,
  showFeaturedBadge = true,
  className,
}: DestinationCardProps) {
  return (
    <Card
      className={`group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className || ""}`}
    >
      <Link href={`/destinations/${destination.slug}`} className="block">
        <div className="relative w-full h-64 overflow-hidden">
          {destination.heroImageUrl ? (
            <Image
              src={destination.heroImageUrl}
              alt={`${destination.city}, ${destination.country}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {destination.isFeatured && showFeaturedBadge && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-500 text-white text-xs">
                <Star className="h-3 w-3 mr-1" />
                Destacado
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-green-600 transition-colors">
            {destination.city}
          </h3>
          <p className="text-sm text-foreground/80 mb-2">
            {destination.country}
          </p>
          {showDescription && destination.description && (
            <p className="text-sm text-foreground/70 line-clamp-2">
              {destination.description}
            </p>
          )}
        </div>
      </Link>
    </Card>
  );
}
