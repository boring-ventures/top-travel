"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  if (!destinations || destinations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 w-full bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">
            Destinos para <span className="font-bold text-blue-600">Bodas</span>{" "}
            de Ensueño
          </h1>
        </div>

        <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="relative overflow-hidden rounded-2xl group flex-shrink-0 w-80"
            >
              <div className="relative h-80 sm:h-96">
                {destination.heroImageUrl ? (
                  <Image
                    src={destination.heroImageUrl}
                    alt={destination.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                    <Heart className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Top Glass Content */}
                <div className="absolute top-0 left-0 right-0 p-6">
                  <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 inline-block">
                    <p className="text-white text-sm font-medium">
                      {destination.name}
                    </p>
                  </div>
                </div>

                {/* Bottom Glass Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="space-y-4">
                    <h2 className="text-white text-2xl font-bold font-serif drop-shadow-lg">
                      {destination.title}
                    </h2>

                    <p className="text-white text-lg font-normal drop-shadow-lg">
                      Consultar precio
                    </p>

                    <Button
                      asChild
                      className="w-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center gap-2"
                    >
                      <Link href="/weddings">
                        <span>Conoce más</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            className="bg-black text-white px-8 py-4 rounded-full hover:bg-black/80 transition-colors duration-300 inline-flex items-center gap-2 text-lg font-semibold"
            href="/weddings"
          >
            Ver Todos
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
