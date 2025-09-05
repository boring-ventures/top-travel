"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, Tag, Package } from "lucide-react";

import { BlurFade } from "@/components/magicui/blur-fade";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { isValidImageUrl } from "@/lib/utils";

type HeroItem = { src: string; title: string; href: string; subtitle?: string };
type OfferItem = {
  id: string;
  title: string;
  subtitle?: string;
  bannerImageUrl?: string;
  package?: { slug: string; fromPrice?: number; currency?: string };
  externalUrl?: string;
  displayTag?: string;
};
type DatabaseTag = {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  _count: {
    packageTags: number;
    destinationTags: number;
  };
};

type HeroProps = {
  items?: HeroItem[];
  featuredOffer?: OfferItem;
  tags?: DatabaseTag[];
};

export default function Hero({ items = [], featuredOffer, tags = [] }: HeroProps) {
  const featured = items[0];
  const fallbackBackgrounds: { src: string; title: string }[] = [
    {
      src: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1600&q=80",
      title: "Beach paradise",
    },
    {
      src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
      title: "Iconic city",
    },
    {
      src: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1600&q=80",
      title: "Mountain adventure",
    },
  ];
  const monthIndex = new Date().getMonth() % fallbackBackgrounds.length;
  const defaultBackgroundSrc = fallbackBackgrounds[monthIndex].src;
  const heroBackgroundSrc =
    featured?.src && isValidImageUrl(featured.src)
      ? featured.src
      : defaultBackgroundSrc;
  const [backgroundSrc, setBackgroundSrc] = useState<string>(heroBackgroundSrc);

  useEffect(() => {
    const validSrc =
      heroBackgroundSrc && isValidImageUrl(heroBackgroundSrc)
        ? heroBackgroundSrc
        : defaultBackgroundSrc;
    setBackgroundSrc(validSrc);
  }, [heroBackgroundSrc, defaultBackgroundSrc]);

  const isVideo = useMemo(() => {
    if (!backgroundSrc) return false;
    return /(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(backgroundSrc);
  }, [backgroundSrc]);

  // Función para obtener el ícono según el tipo de etiqueta
  const getTagIcon = (type: string, name: string) => {
    const lowerName = name.toLowerCase();
    
    // Mapeo de tipos de etiqueta a íconos
    if (type === "THEME") {
      if (lowerName.includes("aventura") || lowerName.includes("trekking") || lowerName.includes("montaña")) {
        return <MapPin className="h-3 w-3 text-emerald-400" />;
      }
      if (lowerName.includes("playa") || lowerName.includes("costa") || lowerName.includes("mar")) {
        return <MapPin className="h-3 w-3 text-cyan-400" />;
      }
      if (lowerName.includes("naturaleza") || lowerName.includes("eco") || lowerName.includes("parque")) {
        return <MapPin className="h-3 w-3 text-green-400" />;
      }
      if (lowerName.includes("ciudad") || lowerName.includes("urbano") || lowerName.includes("metropolitano")) {
        return <MapPin className="h-3 w-3 text-blue-400" />;
      }
      if (lowerName.includes("gastronomía") || lowerName.includes("comida") || lowerName.includes("culinario")) {
        return <MapPin className="h-3 w-3 text-orange-400" />;
      }
      if (lowerName.includes("fotografía") || lowerName.includes("foto") || lowerName.includes("paisaje")) {
        return <MapPin className="h-3 w-3 text-purple-400" />;
      }
      if (lowerName.includes("cultura") || lowerName.includes("tradición") || lowerName.includes("arte")) {
        return <MapPin className="h-3 w-3 text-pink-400" />;
      }
      if (lowerName.includes("compras") || lowerName.includes("shopping") || lowerName.includes("artesanía")) {
        return <MapPin className="h-3 w-3 text-red-400" />;
      }
      if (lowerName.includes("relax") || lowerName.includes("spa") || lowerName.includes("bienestar")) {
        return <MapPin className="h-3 w-3 text-amber-400" />;
      }
    }
    
    // Íconos por defecto según el tipo
    switch (type) {
      case "REGION":
        return <MapPin className="h-3 w-3 text-blue-400" />;
      case "THEME":
        return <Tag className="h-3 w-3 text-green-400" />;
      case "DEPARTMENT":
        return <Package className="h-3 w-3 text-purple-400" />;
      default:
        return <Tag className="h-3 w-3 text-gray-400" />;
    }
  };

  // Función para obtener el color según el tipo
  const getTagColor = (type: string) => {
    switch (type) {
      case "REGION":
        return "bg-blue-500/20 text-blue-200 border-blue-400/30";
      case "THEME":
        return "bg-green-500/20 text-green-200 border-green-400/30";
      case "DEPARTMENT":
        return "bg-purple-500/20 text-purple-200 border-purple-400/30";
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-400/30";
    }
  };



  return (
    <section
      className="relative overflow-hidden -mt-16 sm:-mt-20"
      aria-label="Sección principal de GABYTOPTRAVEL"
      role="region"
    >
      {/* Background media: single featured image or video */}
      <div className="absolute inset-0 z-0">
        {backgroundSrc ? (
          isVideo ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={featured?.title || "Hero background"}
              onError={() => setBackgroundSrc(defaultBackgroundSrc)}
            >
              <source src={backgroundSrc} />
            </video>
          ) : (
            <Image
              src={backgroundSrc}
              alt={featured?.title || "Hero"}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              onError={() => setBackgroundSrc(defaultBackgroundSrc)}
            />
          )
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/60" />
      </div>

      {/* Foreground content */}
      <div
        className="relative z-10 pt-16 sm:pt-20 pb-3 sm:pb-4 md:pb-5 lg:pb-6 xl:pb-7 2xl:pb-8"
        style={{ isolation: "isolate" }}
      >
        <div
          className="container mx-auto"
          style={{ paddingLeft: "12vw", paddingRight: "12vw" }}
        >
          {/* Hero content with full-width components */}
          <div className="flex min-h-[100vh] sm:min-h-[90vh] md:min-h-[85vh] lg:min-h-[80vh] xl:min-h-[75vh] flex-col justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 py-16 sm:py-20">
            {/* Top spacer to push content down */}
            <div className="flex-1 min-h-[40px] sm:min-h-[50px] md:min-h-[60px] lg:min-h-[70px]"></div>

            {/* Main content section - centered text only */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 text-center">
              <BlurFade>
                <div className="flex flex-col gap-2 text-center">
                  <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-[-0.033em] drop-shadow-lg px-2 text-center">
                    Tu viaje soñado empieza aquí
                  </h1>
                </div>
              </BlurFade>
            </div>

            {/* Action Search Bar - Full width */}
            <BlurFade delay={0.08}>
              <div className="relative w-full z-[999999]">
                <ActionSearchBar 
                      placeholder="¿A dónde vas?"
                  className="w-full"
                />
              </div>
            </BlurFade>

            {/* Database Tags Section */}
            {tags && tags.length > 0 && (
              <BlurFade delay={0.12}>
                <div className="w-full max-w-4xl mx-auto -mt-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tags.slice(0, 8).map((dbTag) => (
                      <Link
                        key={dbTag.id}
                        href={`/tags/${dbTag.slug}`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 hover:scale-105 hover:shadow-lg backdrop-blur-sm ${getTagColor(dbTag.type)}`}
                      >
                        {getTagIcon(dbTag.type, dbTag.name)}
                        <span className="font-medium text-xs">{dbTag.name}</span>
                        <span className="text-xs opacity-75">
                          ({dbTag._count.packageTags + dbTag._count.destinationTags})
                        </span>
                      </Link>
                    ))}
                  </div>
                  
                  {tags.length > 8 && (
                    <div className="text-center mt-4">
                      <Link
                        href="/tags"
                        className="inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm"
                      >
                        Ver todas las etiquetas ({tags.length})
                        <svg
                          className="w-3 h-3"
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
                )}
              </div>
            </BlurFade>
            )}

            {/* Bottom spacer to push featured offer to bottom */}
            <div className="flex-1 min-h-[30px] sm:min-h-[40px] md:min-h-[50px] lg:min-h-[60px]"></div>

            {/* Featured Offer Card - Full width */}
            {featuredOffer && (
              <BlurFade delay={0.16} className="-z-50">
                <Link
                  href={
                    featuredOffer.package?.slug
                      ? `/packages/${featuredOffer.package.slug}`
                      : featuredOffer.externalUrl || "#"
                  }
                  className="block group w-full"
                >
                                     <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 hover:shadow-xl w-full relative -z-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {featuredOffer.displayTag && (
                            <span className="bg-corporate-red/10 text-corporate-red text-xs font-medium px-2 py-1 rounded-full">
                              {featuredOffer.displayTag}
                            </span>
                          )}
                                                     <span className="text-white/70 text-xs">
                            Oferta Destacada
                          </span>
                        </div>
                         <h3 className="text-white font-semibold text-base sm:text-lg mb-1 group-hover:text-white/90 transition-colors">
                          {featuredOffer.title}
                        </h3>
                        {featuredOffer.subtitle && (
                           <p className="text-white/80 text-sm sm:text-base">
                            {featuredOffer.subtitle}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {featuredOffer.package?.fromPrice && (
                          <div className="text-right">
                             <p className="text-white/70 text-xs">Desde</p>
                             <p className="text-white font-bold text-lg sm:text-xl">
                              {featuredOffer.package.currency || "$"}
                              {featuredOffer.package.fromPrice}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </BlurFade>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
