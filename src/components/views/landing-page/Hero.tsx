"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";
import { Search } from "lucide-react";

import { BlurFade } from "@/components/magicui/blur-fade";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { isValidImageUrl } from "@/lib/utils";
import { useSearch } from "@/hooks/use-search";
import { SearchResults } from "./search-results";

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
type HeroProps = {
  items?: HeroItem[];
  featuredOffer?: OfferItem;
};

export default function Hero({ items = [], featuredOffer }: HeroProps) {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Search functionality
  const { data: searchData, isLoading: isSearchLoading } =
    useSearch(searchQuery);
  const searchResults = searchData?.results || [];

  // Handle clicks outside search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or packages page with query
      window.location.href = `/packages?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.length >= 2);
  };

  const handleResultClick = () => {
    setShowSearchResults(false);
    setSearchQuery("");
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
            <div className="flex-1 min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[140px]"></div>

            {/* Main content section - centered text only */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 text-center">
              <BlurFade>
                <div className="flex flex-col gap-2 text-center">
                  <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-[-0.033em] drop-shadow-lg px-2 text-center">
                    Tu viaje soñado empieza aquí
                  </h1>
                  <h2 className="text-white text-sm sm:text-base md:text-lg font-normal leading-normal drop-shadow-md px-4 max-w-2xl mx-auto text-center">
                    GabyTop Travel: Creando experiencias de viaje inolvidables y
                    personalizadas en Bolivia y más allá.
                  </h2>
                </div>
              </BlurFade>
            </div>

            {/* Search Bar - Full width */}
            <BlurFade delay={0.08}>
              <div
                ref={searchContainerRef}
                className="relative w-full z-[1000]"
                style={{ isolation: "isolate" }}
              >
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col min-w-40 h-14 w-full sm:h-16"
                >
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div className="text-muted-foreground flex border border-border bg-background/95 items-center justify-center pl-6 sm:pl-8 lg:pl-10 rounded-l-lg border-r-0">
                      <Search className="h-5 w-5" />
                    </div>
                    <Input
                      type="text"
                      placeholder="¿A dónde vas?"
                      value={searchQuery}
                      onChange={handleInputChange}
                      onFocus={() =>
                        searchQuery.length >= 2 && setShowSearchResults(true)
                      }
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-none text-foreground focus:outline-0 focus:ring-0 border border-border bg-background/95 focus:border-border h-full placeholder:text-muted-foreground px-4 border-r-0 border-l-0 text-sm sm:text-base font-normal leading-normal"
                    />
                    <div className="flex items-center justify-center rounded-r-lg border-l-0 border border-border bg-background/95 pr-2">
                      <Button
                        type="submit"
                        className="flex min-w-[140px] max-w-[300px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-8 sm:h-12 sm:px-10 lg:px-12 lg:min-w-[180px] xl:min-w-[220px] bg-primary text-primary-foreground text-sm sm:text-base font-bold leading-normal tracking-[0.015em]"
                      >
                        <span className="truncate">Buscar</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </BlurFade>

            {/* Bottom spacer to push featured offer to bottom */}
            <div className="flex-1 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px]"></div>

            {/* Featured Offer Card - Full width */}
            {featuredOffer && (
              <BlurFade delay={0.16}>
                <Link
                  href={
                    featuredOffer.package?.slug
                      ? `/packages/${featuredOffer.package.slug}`
                      : featuredOffer.externalUrl || "#"
                  }
                  className="block group w-full"
                >
                  <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6 hover:bg-background/98 transition-all duration-300 hover:shadow-lg w-full relative z-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {featuredOffer.displayTag && (
                            <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                              {featuredOffer.displayTag}
                            </span>
                          )}
                          <span className="text-muted-foreground text-xs">
                            Oferta Destacada
                          </span>
                        </div>
                        <h3 className="text-foreground font-semibold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors">
                          {featuredOffer.title}
                        </h3>
                        {featuredOffer.subtitle && (
                          <p className="text-muted-foreground text-sm sm:text-base">
                            {featuredOffer.subtitle}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {featuredOffer.package?.fromPrice && (
                          <div className="text-right">
                            <p className="text-muted-foreground text-xs">
                              Desde
                            </p>
                            <p className="text-foreground font-bold text-lg sm:text-xl">
                              {featuredOffer.package.currency || "$"}
                              {featuredOffer.package.fromPrice}
                            </p>
                          </div>
                        )}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </BlurFade>
            )}

            {/* Search Results Dropdown - Positioned at the end to appear above everything */}
            {showSearchResults && (
              <div
                className="absolute top-0 left-0 right-0 z-[999999] mt-1"
                style={{ top: "calc(50vh + 100px)" }}
              >
                <div
                  className="container mx-auto"
                  style={{ paddingLeft: "12vw", paddingRight: "12vw" }}
                >
                  <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl max-h-80 overflow-y-auto">
                    <SearchResults
                      results={searchResults.slice(0, 5)} // Limit to 5 results
                      isLoading={isSearchLoading}
                      isVisible={showSearchResults}
                      onResultClick={handleResultClick}
                      totalResults={searchResults.length}
                      searchQuery={searchQuery}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
