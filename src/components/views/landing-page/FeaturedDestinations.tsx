"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

interface Destination {
  id: string;
  city: string;
  country: string;
  slug: string;
  heroImageUrl?: string;
  description?: string;
  isFeatured?: boolean;
}

interface FeaturedDestinationsProps {
  destinations: Destination[];
}

export default function FeaturedDestinations({
  destinations,
}: FeaturedDestinationsProps) {
  // Only use actual destinations, no fallbacks
  const finalDestinations = destinations.slice(0, 5);
  const destinationCount = finalDestinations.length;

  // Don't render the section if there are no destinations
  if (destinationCount === 0) {
    return null;
  }

  // Fallback image for destinations without images
  const fallbackImage =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

  const DestinationCard = ({
    destination,
    index,
    className = "",
    height,
    isLarge = false,
  }: {
    destination: Destination;
    index: number;
    className?: string;
    height: string;
    isLarge?: boolean;
  }) => (
    <div className={`relative group overflow-hidden rounded-xl ${className}`}>
      <Link href={`/destinations/${destination.slug}`} className="block h-full">
        <div className={`relative ${height} w-full`}>
          <Image
            src={destination.heroImageUrl || fallbackImage}
            alt={`${destination.city}, ${destination.country}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div
            className={`absolute inset-0 p-6 flex flex-col ${isLarge ? "justify-center items-center text-center" : "justify-end"}`}
          >
            <div className="space-y-3">
              {index === 0 && (
                <Badge
                  variant="secondary"
                  className="w-fit bg-white/20 backdrop-blur-sm text-white border-white/30"
                >
                  ⭐ Destacado
                </Badge>
              )}
              <h3
                className={`font-bold text-white ${isLarge ? "text-2xl sm:text-3xl" : index === 0 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}
              >
                {destination.city}
              </h3>
              <p
                className={`text-white/90 ${isLarge ? "text-sm sm:text-base max-w-md" : "text-sm"}`}
              >
                {destination.description ||
                  `${destination.city}, ${destination.country}`}
              </p>
              {(index === 0 || isLarge) && (
                <Button
                  className="w-fit bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                  size="sm"
                >
                  <span>{isLarge ? "Descubrir" : "Explorar"}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <section
      className="container mx-auto py-8 sm:py-10 md:py-14"
      style={{ paddingLeft: "12vw", paddingRight: "12vw" }}
    >
      <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <AnimatedShinyText>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Destinos Destacados
            </h2>
          </AnimatedShinyText>
          <p className="text-xs sm:text-sm text-foreground/80">
            Explora los destinos más populares de Bolivia
          </p>
        </div>
        <Button
          asChild
          variant="ghost"
          className="ml-auto sm:inline-flex hidden hover:bg-accent text-sm"
        >
          <Link href="/destinations">Ver todos</Link>
        </Button>
      </div>

      {/* Mobile Layout - Enhanced Cards */}
      <div className="grid grid-cols-1 md:hidden gap-6">
        {finalDestinations.map((destination, index) => (
          <div
            key={destination.id}
            className="relative group overflow-hidden rounded-2xl shadow-lg"
          >
            <Link
              href={`/destinations/${destination.slug}`}
              className="block h-full"
            >
              <div className="relative h-72 w-full">
                <Image
                  src={destination.heroImageUrl || fallbackImage}
                  alt={`${destination.city}, ${destination.country}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Top Badge */}
                {index === 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/25 backdrop-blur-md text-white border-white/40 font-semibold"
                    >
                      ⭐ Destacado
                    </Badge>
                  </div>
                )}

                {/* Location Badge */}
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="outline"
                    className="bg-black/30 backdrop-blur-md text-white border-white/30"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {destination.country}
                  </Badge>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {destination.city}
                      </h3>
                      <p className="text-white/95 text-base leading-relaxed">
                        {destination.description ||
                          `${destination.city}, ${destination.country}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        className="bg-white/25 backdrop-blur-md hover:bg-white/35 text-white border-white/40 font-medium px-6 py-2"
                        size="sm"
                      >
                        <span>Explorar</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                      {/* Price indicator */}
                      <div className="text-white/80 text-sm">Desde $800</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop Layout - Adaptive Grid */}
      {destinationCount === 1 && (
        <div className="hidden md:grid md:grid-cols-1 gap-4 sm:gap-6">
          {/* Single destination - full width */}
          <DestinationCard
            destination={finalDestinations[0]}
            index={0}
            height="h-80 sm:h-96"
            isLarge={true}
          />
        </div>
      )}

      {destinationCount === 2 && (
        <div className="hidden md:grid md:grid-cols-2 gap-4 sm:gap-6">
          {/* Two destinations - equal columns */}
          <DestinationCard
            destination={finalDestinations[0]}
            index={0}
            height="h-80 sm:h-96"
          />
          <DestinationCard
            destination={finalDestinations[1]}
            index={1}
            height="h-80 sm:h-96"
          />
        </div>
      )}

      {destinationCount === 3 && (
        <div className="hidden md:grid md:grid-cols-3 gap-4 sm:gap-6">
          {/* First destination - 2/3 width */}
          <DestinationCard
            destination={finalDestinations[0]}
            index={0}
            className="md:col-span-2"
            height="h-80 sm:h-96"
          />

          {/* Second destination - 1/3 width */}
          <DestinationCard
            destination={finalDestinations[1]}
            index={1}
            height="h-80 sm:h-96"
          />

          {/* Third destination - full width bottom */}
          <DestinationCard
            destination={finalDestinations[2]}
            index={2}
            className="md:col-span-3"
            height="h-64 sm:h-72"
            isLarge={true}
          />
        </div>
      )}

      {destinationCount === 4 && (
        <div className="hidden md:grid md:grid-cols-3 gap-4 sm:gap-6">
          {/* Top Row - Large card (2/3) + Small card (1/3) */}
          <DestinationCard
            destination={finalDestinations[0]}
            index={0}
            className="md:col-span-2"
            height="h-80 sm:h-96"
          />
          <DestinationCard
            destination={finalDestinations[1]}
            index={1}
            height="h-80 sm:h-96"
          />

          {/* Bottom Row - Two cards */}
          <DestinationCard
            destination={finalDestinations[2]}
            index={2}
            className="md:col-span-1"
            height="h-64 sm:h-72"
          />
          <DestinationCard
            destination={finalDestinations[3]}
            index={3}
            className="md:col-span-2"
            height="h-64 sm:h-72"
          />
        </div>
      )}

      {destinationCount >= 5 && (
        <div className="hidden md:grid md:grid-cols-3 gap-4 sm:gap-6">
          {/* Top Row - Large card (2/3) + Small card (1/3) */}
          <DestinationCard
            destination={finalDestinations[0]}
            index={0}
            className="md:col-span-2"
            height="h-80 sm:h-96"
          />
          <DestinationCard
            destination={finalDestinations[1]}
            index={1}
            height="h-80 sm:h-96"
          />

          {/* Middle Row - Small card + Large card */}
          <DestinationCard
            destination={finalDestinations[2]}
            index={2}
            className="md:col-span-1"
            height="h-64 sm:h-72"
          />
          <DestinationCard
            destination={finalDestinations[3]}
            index={3}
            className="md:col-span-2"
            height="h-64 sm:h-72"
          />

          {/* Bottom Row - Full width card */}
          <DestinationCard
            destination={finalDestinations[4]}
            index={4}
            className="md:col-span-3"
            height="h-48 sm:h-56"
            isLarge={true}
          />
        </div>
      )}
    </section>
  );
}
