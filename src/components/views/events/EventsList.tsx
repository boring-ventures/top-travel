"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientWhatsAppCTA } from "@/components/utils/client-whatsapp-cta";
import { EventsTabs } from "./EventsTabs";

interface EventsListProps {
  events: {
    music: any[];
    sports: any[];
    special: any[];
    all: any[];
  };
  whatsappTemplates: any;
  fallbackImages: Record<string, string>;
}

export function EventsList({
  events,
  whatsappTemplates,
  fallbackImages,
}: EventsListProps) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [displayedEvents, setDisplayedEvents] = useState(events.all);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (
      categoryParam &&
      ["all", "music", "sports", "special"].includes(categoryParam)
    ) {
      setActiveCategory(categoryParam);
      setDisplayedEvents(
        events[categoryParam as keyof typeof events] || events.all
      );
    } else {
      setActiveCategory("all");
      setDisplayedEvents(events.all);
    }
  }, [searchParams, events]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setDisplayedEvents(events[category as keyof typeof events] || events.all);
  };

  // Helper function to get valid image URL
  const getValidImageUrl = (
    url: string | null | undefined,
    fallback: string
  ) => {
    if (!url || url === "1" || url === "null" || url === "undefined") {
      return fallback;
    }
    return url;
  };

  // Helper function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  // Helper function to get location text
  const getLocationText = (event: any) => {
    if (event.destination?.city && event.destination?.country) {
      return `${event.destination.city}, ${event.destination.country}`;
    }
    return "";
  };

  // Helper function to get fallback image based on category
  const getFallbackImage = (category: string) => {
    switch (category) {
      case "music":
        return fallbackImages.concerts;
      case "sports":
        return fallbackImages.sports;
      case "special":
        return fallbackImages.cultural;
      default:
        return fallbackImages.concerts;
    }
  };

  // Check if there are any events at all across all categories
  const hasAnyEvents =
    events.all.length > 0 ||
    events.music.length > 0 ||
    events.sports.length > 0 ||
    events.special.length > 0;

  // If there are no events at all, show the no events message without tabs
  if (!hasAnyEvents) {
    return (
      <div className="text-center py-20">
        <div className="text-muted-foreground mb-6">
          <Compass className="h-20 w-20 mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-semibold mb-3 text-foreground">
            No se encontraron eventos
          </h3>
          <p className="text-lg max-w-md mx-auto text-muted-foreground">
            No hay eventos disponibles en este momento. Consulta con nosotros
            para eventos próximos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button asChild variant="outline">
              <Link href="/contact">Contactar</Link>
            </Button>
            <ClientWhatsAppCTA
              whatsappTemplate={
                whatsappTemplates.events
                  ? {
                      templateBody: whatsappTemplates.events.templateBody,
                      phoneNumber: whatsappTemplates.events.phoneNumber,
                      phoneNumbers: whatsappTemplates.events.phoneNumbers,
                    }
                  : whatsappTemplates.general
                    ? {
                        templateBody: whatsappTemplates.general.templateBody,
                        phoneNumber: whatsappTemplates.general.phoneNumber,
                        phoneNumbers: whatsappTemplates.general.phoneNumbers,
                      }
                    : undefined
              }
              template={
                whatsappTemplates.events?.templateBody ||
                whatsappTemplates.general?.templateBody ||
                "Hola! Quiero información sobre eventos próximos."
              }
              variables={{
                context: "eventos",
                searchQuery: "",
              }}
              campaign="events_search"
              content="no_results"
              label="Consultar por WhatsApp"
              size="default"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <EventsTabs events={events} onCategoryChange={handleCategoryChange} />

      {/* Show no events message for current category if no events in this category but events exist in others */}
      {displayedEvents.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-muted-foreground mb-6">
            <Compass className="h-20 w-20 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold mb-3 text-foreground">
              No se encontraron eventos
            </h3>
            <p className="text-lg max-w-md mx-auto text-muted-foreground">
              No hay eventos disponibles en esta categoría. Consulta con
              nosotros para eventos próximos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button asChild variant="outline">
                <Link href="/contact">Contactar</Link>
              </Button>
              <ClientWhatsAppCTA
                whatsappTemplate={
                  whatsappTemplates.events
                    ? {
                        templateBody: whatsappTemplates.events.templateBody,
                        phoneNumber: whatsappTemplates.events.phoneNumber,
                        phoneNumbers: whatsappTemplates.events.phoneNumbers,
                      }
                    : whatsappTemplates.general
                      ? {
                          templateBody: whatsappTemplates.general.templateBody,
                          phoneNumber: whatsappTemplates.general.phoneNumber,
                          phoneNumbers: whatsappTemplates.general.phoneNumbers,
                        }
                      : undefined
                }
                template={
                  whatsappTemplates.events?.templateBody ||
                  whatsappTemplates.general?.templateBody ||
                  "Hola! Quiero información sobre eventos próximos."
                }
                variables={{
                  context: "eventos",
                  searchQuery: "",
                }}
                campaign="events_search"
                content="no_results"
                label="Consultar por WhatsApp"
                size="default"
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {displayedEvents.length}{" "}
              <span className="font-light italic">evento</span>
              {displayedEvents.length !== 1 ? "s" : ""} encontrado
              {displayedEvents.length !== 1 ? "s" : ""}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {activeCategory === "all"
                ? "Descubre todos los eventos disponibles y vive experiencias únicas"
                : `Explora los mejores eventos de ${categories.find((c) => c.id === activeCategory)?.label.toLowerCase() || "esta categoría"}`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedEvents.map((event) => (
              <div
                key={event.id}
                className="relative overflow-hidden rounded-2xl group"
              >
                <div className="relative h-80 sm:h-96">
                  <Image
                    src={getValidImageUrl(
                      event.heroImageUrl,
                      getFallbackImage(activeCategory)
                    )}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Top Glass Content */}
                  <div className="absolute top-0 left-0 right-0 p-6">
                    <div className="flex justify-between items-start">
                      <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 inline-block">
                        <p className="text-white text-sm font-medium">
                          {getLocationText(event)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Glass Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="space-y-4">
                      <h2 className="text-white text-2xl font-bold font-serif drop-shadow-lg">
                        {event.title}
                      </h2>

                      <p className="text-white text-lg font-normal drop-shadow-lg">
                        {formatDate(event.startDate)}
                      </p>

                      <Button
                        asChild
                        className="w-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center gap-2"
                      >
                        <Link href={`/events/${event.slug}`}>
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

          {/* View All Button - Centered below cards */}
          <div className="mt-12 text-center">
            <Button
              asChild
              className="bg-black text-white px-8 py-4 rounded-full hover:bg-black/80 transition-colors duration-300 inline-flex items-center gap-2 text-lg font-semibold"
            >
              <Link href="/events">
                Ver Todos los Eventos
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

const categories = [
  { id: "all", label: "Todos" },
  { id: "music", label: "Música" },
  { id: "sports", label: "Deportes" },
  { id: "special", label: "Especiales" },
];
