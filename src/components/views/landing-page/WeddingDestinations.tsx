"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ShineBorder } from "@/components/magicui/shine-border";

interface WeddingDestination {
  id: string;
  slug: string;
  name: string;
  title: string;
  description?: string;
  heroImageUrl?: string;
  isFeatured: boolean;
}

interface WeddingDestinationsProps {
  destinations: WeddingDestination[];
}

export default function WeddingDestinations({
  destinations,
}: WeddingDestinationsProps) {
  if (!destinations || destinations.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
          Destinos para Bodas de Ensueño
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Lugares mágicos donde el amor se encuentra con la aventura
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {destinations.map((destination) => (
          <ShineBorder
            key={destination.id}
            className="rounded-xl w-full"
            borderWidth={1}
          >
            <Card className="flex h-full flex-col gap-4 p-4 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
              <Link href={`/weddings`} className="block flex-1">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4">
                  {destination.heroImageUrl ? (
                    <Image
                      src={destination.heroImageUrl}
                      alt={destination.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                      <Heart className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-2">
                  <div className="text-lg font-bold mb-2 text-foreground">
                    {destination.title}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {destination.description ||
                      "Celebra tu amor en un entorno impresionante"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{destination.name}</span>
                  </div>
                </div>
              </Link>
              <div className="mt-auto p-2">
                <Button asChild variant="outline" className="w-full rounded-lg">
                  <Link href={`/weddings`}>Ver Detalles</Link>
                </Button>
              </div>
            </Card>
          </ShineBorder>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link href="/weddings">Ver Todos los Destinos</Link>
        </Button>
      </div>
    </section>
  );
}
