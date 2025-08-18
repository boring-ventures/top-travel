"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, Car, Wifi, ArrowRight } from "lucide-react";
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
  location?: string;
};

export default function TravelCard({
  id,
  title,
  price,
  description,
  imageUrl,
  href,
  amenities = ["View", "Free parking", "Wi-Fi"],
  location,
}: TravelCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "view":
        return <Eye className="h-3 w-3" />;
      case "free parking":
        return <Car className="h-3 w-3" />;
      case "wi-fi":
        return <Wifi className="h-3 w-3" />;
      default:
        return <Eye className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex flex-col bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow duration-200 h-full">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        {location && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-md">
            <span className="text-xs font-medium text-card-foreground">
              {location}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-1">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold text-card-foreground leading-tight flex-1">
            {title}
          </h3>
          {price && (
            <span className="text-sm sm:text-base font-semibold text-card-foreground whitespace-nowrap">
              {price}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
          {description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {amenities.map((amenity, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs px-2 py-1 bg-secondary text-secondary-foreground border-0"
            >
              <span className="flex items-center gap-1">
                {getAmenityIcon(amenity)}
                <span className="hidden sm:inline">{amenity}</span>
                <span className="sm:hidden">{amenity.split(" ")[0]}</span>
              </span>
            </Badge>
          ))}
        </div>

        {/* Call to Action */}
        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 sm:py-2.5 rounded-lg transition-colors duration-200 text-sm sm:text-base"
        >
          <Link href={href} className="flex items-center justify-center gap-2">
            <span>Reservar ahora</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
