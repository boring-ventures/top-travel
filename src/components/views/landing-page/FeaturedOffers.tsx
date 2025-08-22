"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import { isValidImageUrl } from "@/lib/utils";
import PromotionalCard from "./PromotionalCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollTo = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of one card + gap
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // Check scroll buttons on mount and when offers change
  useEffect(() => {
    checkScrollButtons();
    // Add resize listener to recheck on window resize
    const handleResize = () => checkScrollButtons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [offers]);

  return (
    <section
      className="container mx-auto py-8 sm:py-10 md:py-14"
      style={{ paddingLeft: "12vw", paddingRight: "12vw" }}
    >
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <AnimatedShinyText>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Ofertas destacadas
            </h2>
          </AnimatedShinyText>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Promociones seleccionadas del mes
          </p>
        </div>
        <Button
          asChild
          variant="ghost"
          className="ml-auto sm:inline-flex hidden hover:bg-accent text-sm"
        >
          <Link href="/packages">Ver todas</Link>
        </Button>
      </div>

      {offers.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No hay ofertas destacadas por el momento.
        </div>
      ) : (
        <div className="relative group">
          {/* Navigation Buttons */}
          <Button
            onClick={() => scrollTo("left")}
            disabled={!canScrollLeft}
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => scrollTo("right")}
            disabled={!canScrollRight}
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide"
            onScroll={checkScrollButtons}
          >
            <div className="flex items-stretch p-2 sm:p-4 gap-3 sm:gap-4">
              {offers.map((o) => {
                const href = o.package?.slug
                  ? `/packages/${o.package.slug}`
                  : o.externalUrl || "#";
                const description =
                  o.subtitle ||
                  o.package?.summary ||
                  "Descubre esta increíble oferta";

                return (
                  <div key={o.id} className="w-72 sm:w-80 flex-shrink-0">
                    <PromotionalCard
                      id={o.id}
                      title={o.title}
                      subtitle={o.subtitle || ""}
                      description={description}
                      imageUrl={
                        o.bannerImageUrl && isValidImageUrl(o.bannerImageUrl)
                          ? o.bannerImageUrl
                          : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"
                      }
                      href={href}
                      location="Bolivia"
                      resortName="GabyTop Travel"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
