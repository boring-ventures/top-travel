"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { isValidImageUrl } from "@/lib/utils";

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
  // Ensure we have at least 5 destinations for the bento layout
  const displayDestinations = destinations.slice(0, 5);

  // Fallback destinations if we don't have enough
  const fallbackDestinations = [
    {
      id: "1",
      city: "La Paz",
      country: "Bolivia",
      slug: "la-paz",
      heroImageUrl:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      description: "La ciudad más alta del mundo",
    },
    {
      id: "2",
      city: "Santa Cruz",
      country: "Bolivia",
      slug: "santa-cruz",
      heroImageUrl:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
      description: "Tierra de contrastes y diversidad",
    },
    {
      id: "3",
      city: "Cochabamba",
      country: "Bolivia",
      slug: "cochabamba",
      heroImageUrl:
        "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=800&q=80",
      description: "La ciudad de la eterna primavera",
    },
    {
      id: "4",
      city: "Sucre",
      country: "Bolivia",
      slug: "sucre",
      heroImageUrl:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
      description: "La ciudad blanca de América",
    },
    {
      id: "5",
      city: "Tarija",
      country: "Bolivia",
      slug: "tarija",
      heroImageUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
      description: "La tierra del vino y el buen vivir",
    },
  ];

  const finalDestinations =
    displayDestinations.length >= 5
      ? displayDestinations
      : fallbackDestinations;

  return (
    <section
      className="container mx-auto py-8 sm:py-10 md:py-14"
      style={{ paddingLeft: "12vw", paddingRight: "12vw" }}
    >
      <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <AnimatedShinyText>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
              Destinos Destacados
            </h2>
          </AnimatedShinyText>
          <p className="text-xs sm:text-sm text-muted-foreground">
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

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Top Row - Large card (2/3) + Small card (1/3) */}
        <div className="md:col-span-2 relative group overflow-hidden rounded-xl">
          <Link
            href={`/destinations/${finalDestinations[0].slug}`}
            className="block h-full"
          >
            <div className="relative h-80 sm:h-96 w-full">
              <Image
                src={
                  finalDestinations[0].heroImageUrl ||
                  fallbackDestinations[0].heroImageUrl
                }
                alt={`${finalDestinations[0].city}, ${finalDestinations[0].country}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="space-y-3">
                  <Badge
                    variant="secondary"
                    className="w-fit bg-white/20 backdrop-blur-sm text-white border-white/30"
                  >
                    Destacado
                  </Badge>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {finalDestinations[0].city}
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    {finalDestinations[0].description ||
                      `${finalDestinations[0].city}, ${finalDestinations[0].country}`}
                  </p>
                  <Button
                    className="w-fit bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                    size="sm"
                  >
                    <span>Explorar</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="relative group overflow-hidden rounded-xl">
          <Link
            href={`/destinations/${finalDestinations[1].slug}`}
            className="block h-full"
          >
            <div className="relative h-80 sm:h-96 w-full">
              <Image
                src={
                  finalDestinations[1].heroImageUrl ||
                  fallbackDestinations[1].heroImageUrl
                }
                alt={`${finalDestinations[1].city}, ${finalDestinations[1].country}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {finalDestinations[1].city}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {finalDestinations[1].description ||
                      `${finalDestinations[1].city}, ${finalDestinations[1].country}`}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Middle Row - First card smaller, second card bigger */}
        <div className="md:col-span-1 relative group overflow-hidden rounded-xl">
          <Link
            href={`/destinations/${finalDestinations[2].slug}`}
            className="block h-full"
          >
            <div className="relative h-64 sm:h-72 w-full">
              <Image
                src={
                  finalDestinations[2].heroImageUrl ||
                  fallbackDestinations[2].heroImageUrl
                }
                alt={`${finalDestinations[2].city}, ${finalDestinations[2].country}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {finalDestinations[2].city}
                  </h3>
                  <p className="text-white/90 text-xs sm:text-sm">
                    {finalDestinations[2].description ||
                      `${finalDestinations[2].city}, ${finalDestinations[2].country}`}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="md:col-span-2 relative group overflow-hidden rounded-xl">
          <Link
            href={`/destinations/${finalDestinations[3].slug}`}
            className="block h-full"
          >
            <div className="relative h-64 sm:h-72 w-full">
              <Image
                src={
                  finalDestinations[3].heroImageUrl ||
                  fallbackDestinations[3].heroImageUrl
                }
                alt={`${finalDestinations[3].city}, ${finalDestinations[3].country}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {finalDestinations[3].city}
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    {finalDestinations[3].description ||
                      `${finalDestinations[3].city}, ${finalDestinations[3].country}`}
                  </p>
                  <Button
                    className="w-fit bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                    size="sm"
                  >
                    <span>Explorar</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Row - Full width card */}
        <div className="md:col-span-3 relative group overflow-hidden rounded-xl">
          <Link
            href={`/destinations/${finalDestinations[4].slug}`}
            className="block h-full"
          >
            <div className="relative h-48 sm:h-56 w-full">
              <Image
                src={
                  finalDestinations[4].heroImageUrl ||
                  fallbackDestinations[4].heroImageUrl
                }
                alt={`${finalDestinations[4].city}, ${finalDestinations[4].country}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {finalDestinations[4].city}
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base max-w-md">
                    {finalDestinations[4].description ||
                      `${finalDestinations[4].city}, ${finalDestinations[4].country}`}
                  </p>
                  <Button
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                    size="sm"
                  >
                    <span>Descubrir</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
