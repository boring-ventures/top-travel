import prisma from "@/lib/prisma";
import { filterValidImageUrls } from "@/lib/utils";
import { getWhatsAppTemplateByUsage } from "@/lib/whatsapp-utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import TabbedContent from "@/components/views/landing-page/TabbedContent";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Filter,
  Music,
  Sparkles,
  Compass,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { ShineBorder } from "@/components/magicui/shine-border";

// Fallback images for different categories
const FALLBACK_IMAGES = {
  concerts:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
  festivals:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&q=80",
  cultural:
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
  sports:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
};

interface EventsPageProps {
  searchParams?: Promise<{
    q?: string;
    country?: string;
    city?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const q = params?.q?.trim() || undefined;
  const country = params?.country || undefined;
  const city = params?.city || undefined;
  const from = params?.from;
  const to = params?.to;

  let concerts: any[] = [];
  let festivals: any[] = [];
  let cultural: any[] = [];
  let sports: any[] = [];
  let filteredEvents: any[] = [];
  let allEventsData: any[] = [];
  let countries: any[] = [];
  let cities: any[] = [];
  let whatsappTemplates: any = {};

  // Check if there are active filters
  const hasActiveFilters = q || (country && country !== "all") || city || from || to;

  try {
    // Build where clause for filtered events
  const where: any = {
    status: "PUBLISHED",
    locationCountry: country === "all" ? undefined : country,
    locationCity: city,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { artistOrEvent: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    ...(from || to
      ? {
          AND: [
            from ? { endDate: { gte: new Date(from) } } : {},
            to ? { startDate: { lte: new Date(to) } } : {},
          ],
        }
      : {}),
  };

    const results = await Promise.all([
      // Concerts
      prisma.event.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { startDate: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          artistOrEvent: true,
          heroImageUrl: true,
          startDate: true,
          endDate: true,
          locationCity: true,
          locationCountry: true,
        },
      }),
      // Festivals
      prisma.event.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { startDate: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          artistOrEvent: true,
          heroImageUrl: true,
          startDate: true,
          endDate: true,
          locationCity: true,
          locationCountry: true,
        },
      }),
      // Cultural
      prisma.event.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { startDate: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          artistOrEvent: true,
          heroImageUrl: true,
          startDate: true,
          endDate: true,
          locationCity: true,
          locationCountry: true,
        },
      }),
      // Sports
      prisma.event.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { startDate: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          artistOrEvent: true,
          heroImageUrl: true,
          startDate: true,
          endDate: true,
          locationCity: true,
          locationCountry: true,
        },
      }),
      // Filtered events query
      hasActiveFilters ? prisma.event.findMany({
        where,
        orderBy: { startDate: "asc" },
        take: 30,
      }) : Promise.resolve([]),
      // Get unique countries and cities for filters
      prisma.event.findMany({
        where: { status: "PUBLISHED" },
        select: { locationCountry: true, locationCity: true },
        orderBy: [{ locationCountry: "asc" }, { locationCity: "asc" }],
      }),
    ]);
    [concerts, festivals, cultural, sports, filteredEvents, allEventsData] = results as any;

        const uniqueCountries = [
      ...new Set(allEventsData.map((e) => e.locationCountry)),
  ].filter((c): c is string => Boolean(c));
    const uniqueCities = [...new Set(allEventsData.map((e) => e.locationCity))].filter(
    Boolean
  );
    countries = uniqueCountries;
    cities = uniqueCities;

    // Fetch WhatsApp templates for different usage types
    whatsappTemplates = {
      events: await getWhatsAppTemplateByUsage("EVENTS"),
      general: await getWhatsAppTemplateByUsage("GENERAL"),
    };
  } catch (err) {
    console.error("Events data fetch failed", err);
  }

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
    if (event.locationCity && event.locationCountry) {
      return `${event.locationCity}, ${event.locationCountry}`;
    }
    return "Bolivia";
  };

  // Prepare tabbed content data - Show ALL items without limit
  const tabbedContent = [
    {
      id: "concerts",
      label: "Conciertos",
      href: "/events",
      items: concerts.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.artistOrEvent || "Concierto musical",
        imageUrl: getValidImageUrl(event.heroImageUrl, FALLBACK_IMAGES.concerts),
        href: `/events/${event.slug}`,
        price: formatDate(event.startDate),
        location: getLocationText(event),
      })),
    },
    {
      id: "festivals",
      label: "Festivales",
      href: "/events",
      items: festivals.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.artistOrEvent || "Festival de música",
        imageUrl: getValidImageUrl(event.heroImageUrl, FALLBACK_IMAGES.festivals),
        href: `/events/${event.slug}`,
        price: formatDate(event.startDate),
        location: getLocationText(event),
      })),
    },
    {
      id: "cultural",
      label: "Culturales",
      href: "/events",
      items: cultural.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.artistOrEvent || "Evento cultural",
        imageUrl: getValidImageUrl(event.heroImageUrl, FALLBACK_IMAGES.cultural),
        href: `/events/${event.slug}`,
        price: formatDate(event.startDate),
        location: getLocationText(event),
      })),
    },
    {
      id: "sports",
      label: "Deportivos",
      href: "/events",
      items: sports.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.artistOrEvent || "Evento deportivo",
        imageUrl: getValidImageUrl(event.heroImageUrl, FALLBACK_IMAGES.sports),
        href: `/events/${event.slug}`,
        price: formatDate(event.startDate),
        location: getLocationText(event),
      })),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        {/* Hero Section */}
        <section className="relative">
          <AnimatedHero
            title="Descubre los mejores"
            subtitle="del mundo"
            description="Conciertos, festivales y eventos únicos que crean experiencias inolvidables. Desde música en vivo hasta festivales internacionales."
            animatedWords={["Eventos", "Conciertos", "Festivales", "Momentos"]}
            backgroundImage="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1920&q=80"
            animatedWordColor="text-white"
            accentColor="bg-white"
          />
        </section>

        {/* Search and Filters Section */}
        <section className="bg-white py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">
              Encuentra el mejor <span className="font-light italic">evento</span> para ti
            </h2>
            <form method="get">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end w-full">
                <div>
                  <label className="block text-sm font-bold italic text-gray-700 mb-2">
                    Búsqueda
                  </label>
                    <Input
                    className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl"
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Buscar eventos..."
                    />
                  </div>
                <div>
                  <label className="block text-sm font-bold italic text-gray-700 mb-2">
                    País
                  </label>
                  <Select name="country" defaultValue={country || "all"}>
                    <SelectTrigger className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl">
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los países</SelectItem>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-bold italic text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <Input
                    className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl"
                    type="text"
                    name="city"
                    defaultValue={city}
                    placeholder="Buscar ciudad..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold italic text-gray-700 mb-2">
                    Fecha Desde
                  </label>
                  <Input
                    className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl"
                    type="date"
                    name="from"
                    defaultValue={from}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    className="h-12 w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium rounded-xl"
                  >
                    Buscar Eventos »
                  </Button>
                </div>
                </div>
              </form>
          </div>
        </section>

        {/* Results Section */}
        {hasActiveFilters ? (
          <section className="py-8 w-full bg-white">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-muted-foreground mb-6">
                <Compass className="h-20 w-20 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  No se encontraron eventos
                </h3>
                <p className="text-lg max-w-md mx-auto text-muted-foreground">
                  Intenta ajustar tus filtros de búsqueda o consulta con
                  nosotros para eventos próximos
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button asChild variant="outline">
                    <Link href="/contact">Contactar</Link>
                  </Button>
                  <WhatsAppCTA
                    template="Hola! Quiero información sobre eventos próximos."
                    variables={{}}
                    label="Consultar por WhatsApp"
                    size="default"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
                  <div className="flex items-center justify-between mb-6">
                <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-left">
                        {filteredEvents.length} <span className="font-light italic">evento</span>{filteredEvents.length !== 1 ? "s" : ""}{" "}
                        encontrado{filteredEvents.length !== 1 ? "s" : ""}
                  </h2>
                      <p className="text-gray-600">
                        Resultados de tu búsqueda
                  </p>
                </div>
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                      <div key={event.id} className="relative overflow-hidden rounded-lg group">
                        <Link href={`/events/${event.slug}`} className="block">
                          <div className="relative h-64 sm:h-72">
                            <Image
                              src={event.heroImageUrl && event.heroImageUrl !== "1" && event.heroImageUrl !== "null" ? event.heroImageUrl : FALLBACK_IMAGES.concerts}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent p-6 flex flex-col justify-start">
                              <div>
                                <h2 className="text-white text-xl font-semibold uppercase">
                            {event.title}
                                </h2>
                                <p className="text-white">{getLocationText(event)}</p>
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                              <div className="flex justify-between items-center">
                                <p className="text-white text-lg font-bold">
                                  {formatDate(event.startDate)}
                                </p>
                                <div className="text-white">
                                  <ArrowRight className="h-5 w-5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      </div>
                    ))}
              </div>
            </>
          )}
            </div>
          </section>
        ) : (
          /* Tabbed Content Section */
          <section className="py-12 w-full bg-white">
            <div className="container mx-auto px-4">
            <TabbedContent tabs={tabbedContent} showViewAllButton={false} />
            </div>
        </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
