"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TravelCardProps = {
  id: string;
  title: string;
  price?: string;
  description: string;
  imageUrl: string;
  href: string;
  amenities?: string[];
  exclusions?: string[];
  location?: string;
};

export default function TravelCard({
  id,
  title,
  price,
  description,
  imageUrl,
  href,
  amenities = [],
  exclusions = [],
  location,
}: TravelCardProps) {
  return (
    <div className="group relative bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
      {/* Full Image Background */}
      <div className="relative w-full h-full min-h-[360px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
          {/* Location Badge */}
          {location && (
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
              <span className="text-xs font-medium text-white flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {location}
              </span>
            </div>
          )}

          {/* Price Badge */}
          {price && (
            <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-sm font-bold text-white">{price}</span>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-3">
            {/* Title */}
            <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
              {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-white/90 leading-relaxed line-clamp-2">
              {description}
            </p>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {amenities.slice(0, 3).map((amenity, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm text-white border-white/30"
                  >
                    {amenity}
                  </Badge>
                ))}
                {amenities.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm text-white border-white/30"
                  >
                    +{amenities.length - 3} más
                  </Badge>
                )}
              </div>
            )}

            {/* Call to Action */}
            <Button
              asChild
              className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 border border-white/30 group-hover:border-white/50"
            >
              <Link
                href={href}
                className="flex items-center justify-center gap-2"
              >
                <span>Explorar destino</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
