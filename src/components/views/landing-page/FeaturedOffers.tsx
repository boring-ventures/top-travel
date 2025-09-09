"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isValidImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Offer {
  id: string;
  title: string;
  subtitle?: string;
  bannerImageUrl?: string;
  displayTag?: string;
  externalUrl?: string;
  package?: {
    slug?: string;
    title?: string;
    fromPrice?: number;
    currency?: string;
    summary?: string;
  };
}

interface FeaturedOffersProps {
  offers: Offer[];
  whatsappTemplate?: {
    templateBody: string;
    phoneNumber?: string;
  };
}

export default function FeaturedOffers({
  offers,
  whatsappTemplate,
}: FeaturedOffersProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <section className="py-16 w-full bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            Ofertas <span className="font-bold text-blue-600">Destacadas</span>{" "}
            del Mes
          </h1>
        </div>

        {offers.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No hay ofertas destacadas por el momento.
          </div>
        ) : (
          <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4">
            {offers.map((o) => {
              const href = o.package?.slug
                ? `/packages/${o.package.slug}`
                : o.externalUrl || "#";
              const price = o.package?.fromPrice
                ? `Desde $${o.package.fromPrice}`
                : "Consultar precio";

              return (
                <div
                  key={o.id}
                  className="relative overflow-hidden rounded-2xl group flex-shrink-0 w-80"
                >
                  <div className="relative h-80 sm:h-96">
                    <Image
                      src={
                        o.bannerImageUrl && isValidImageUrl(o.bannerImageUrl)
                          ? o.bannerImageUrl
                          : "/api/placeholder/400/300"
                      }
                      alt={o.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Top Glass Content */}
                    <div className="absolute top-0 left-0 right-0 p-6">
                      <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 inline-block">
                        <p className="text-white text-sm font-medium">
                          {o.subtitle || "Oferta especial"}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Glass Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="space-y-4">
                        <h2 className="text-white text-2xl font-bold font-serif drop-shadow-lg">
                          {o.title}
                        </h2>

                        <p className="text-white text-lg font-normal drop-shadow-lg">
                          {price}
                        </p>

                        <Button
                          asChild
                          className="w-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center gap-2"
                        >
                          <Link href={href}>
                            <span>Conoce más</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            className="bg-black text-white px-8 py-4 rounded-full hover:bg-black/80 transition-colors duration-300 inline-flex items-center gap-2 text-lg font-semibold"
            href="/packages"
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
