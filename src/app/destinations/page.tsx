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
  Compass,
  ArrowRight,
  Globe,
  Info,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";

// Fallback images for different categories
const FALLBACK_IMAGES = {
  events:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
  destinations:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
  mountains:
    "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=400&q=80",
  beaches:
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=400&q=80",
};

// Default data for when database is empty
const DEFAULT_DATA = {
  events: [
    {
      id: "1",
      title: "Rock Fest Bolivia",
      locationCity: "La Paz",
      locationCountry: "Bolivia",
      slug: "rock-fest",
    },
    {
      id: "2",
      title: "Electronic Dance Carnival",
      locationCity: "Santa Cruz",
      locationCountry: "Bolivia",
      slug: "electronic-carnival",
    },
    {
      id: "3",
      title: "Latin Music Extravaganza",
      locationCity: "Cochabamba",
      locationCountry: "Bolivia",
      slug: "latin-music",
    },
  ],
  destinations: [
    {
      id: "1",
      city: "La Paz",
      country: "Bolivia",
      slug: "la-paz",
      heroImageUrl: FALLBACK_IMAGES.destinations,
    },
    {
      id: "2",
      city: "Santa Cruz",
      country: "Bolivia",
      slug: "santa-cruz",
      heroImageUrl: FALLBACK_IMAGES.destinations,
    },
    {
      id: "3",
      city: "Cochabamba",
      country: "Bolivia",
      slug: "cochabamba",
      heroImageUrl: FALLBACK_IMAGES.destinations,
    },
  ],
};

interface DestinationsPageProps {
  searchParams?: Promise<{
    q?: string;
    country?: string;
    city?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
  const params = await searchParams;
  const q = params?.q?.trim() || undefined;
  const country = params?.country || undefined;
  const city = params?.city || undefined;
  const from = params?.from;
  const to = params?.to;

  let allDestinations: any[] = [];
  let featuredEvents: any[] = [];
  let fixedDepartures: any[] = [];
  let filteredDestinations: any[] = [];
  let allDestinationsData: any[] = [];
  let countries: any[] = [];
  let cities: any[] = [];
  let whatsappTemplates: any = {};

  // Check if there are active filters
  const hasActiveFilters = q || (country && country !== "all") || city || from || to;

  try {
    // Build where clause for filtered destinations
    const where: any = {
      ...(q
        ? {
            OR: [
              { city: { contains: q, mode: "insensitive" } },
              { country: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      country: country === "all" ? undefined : country,
      city: city,
    };

    const results = await Promise.all([
      // All destinations (not just top destinations)
      prisma.destination.findMany({
        orderBy: [
          { country: "asc" },
          { city: "asc" }
        ],
        select: {
          id: true,
          slug: true,
          city: true,
          country: true,
          heroImageUrl: true,
        },
      }),
      // Events
      prisma.event.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { startDate: "asc" },
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          locationCity: true,
          locationCountry: true,
          heroImageUrl: true,
          amenities: true,
          exclusions: true,
          startDate: true,
          endDate: true,
        },
      }),
      // Fixed departures
      prisma.fixedDeparture.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { startDate: "asc" },
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          heroImageUrl: true,
          amenities: true,
          exclusions: true,
          startDate: true,
          endDate: true,
        },
      }),
      // Filtered destinations query
      hasActiveFilters ? prisma.destination.findMany({
        where,
        orderBy: [{ country: "asc" }, { city: "asc" }],
        take: 30,
        select: {
          id: true,
          slug: true,
          city: true,
          country: true,
          heroImageUrl: true,
        },
      }) : Promise.resolve([]),
      // Get all destinations for filters
      prisma.destination.findMany({
        select: { country: true, city: true },
        orderBy: [{ country: "asc" }, { city: "asc" }],
      }),
    ]);
    [allDestinations, featuredEvents, fixedDepartures, filteredDestinations, allDestinationsData] = results as any;

    // Get unique countries and cities for filters
    const uniqueCountries = [
      ...new Set(allDestinationsData.map((d) => d.country)),
    ].filter((c): c is string => Boolean(c));
    const uniqueCities = [...new Set(allDestinationsData.map((d) => d.city))].filter(
      Boolean
    );
    countries = uniqueCountries;
    cities = uniqueCities;

    // Fetch WhatsApp templates for different usage types
    whatsappTemplates = {
      destinations: await getWhatsAppTemplateByUsage("DESTINATIONS"),
      general: await getWhatsAppTemplateByUsage("GENERAL"),
    };
  } catch (err) {
    console.error("Destinations data fetch failed", err);
  }

  // Use default data if no data from database
  if (!allDestinations.length) allDestinations = DEFAULT_DATA.destinations;
  if (!featuredEvents.length) featuredEvents = DEFAULT_DATA.events;

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

  // Helper function to get location text
  const getLocationText = (destination: any) => {
    if (destination.city && destination.country) {
      return `${destination.city}, ${destination.country}`;
    }
    return "Destino";
  };

  // Prepare tabbed content data - Show ALL items without limit
  const tabbedContent = [
    {
      id: "destinations",
      label: "Todos los Destinos",
      href: "/destinations",
      items: allDestinations.map((dest) => ({
        id: dest.id,
        title: `${dest.city}, ${dest.country}`,
        description:
          "Explora destinos increíbles con nuestras experiencias únicas",
        imageUrl: getValidImageUrl(
          dest.heroImageUrl,
          FALLBACK_IMAGES.destinations
        ),
        href: `/destinations/${dest.slug}`,
        price: "$800/persona",
        location: `${dest.city}, ${dest.country}`,
      })),
    },
    {
      id: "events",
      label: "Conciertos & Eventos",
      href: "/events",
      items: featuredEvents.map((event) => ({
        id: event.id,
        title: event.title,
        description: `${event.locationCity}, ${event.locationCountry}`,
        imageUrl: getValidImageUrl(event.heroImageUrl, FALLBACK_IMAGES.events),
        href: `/events/${event.slug}`,
        price: "$150/persona",
        location: `${event.locationCity}, ${event.locationCountry}`,
        amenities: event.amenities || [],
        exclusions: event.exclusions || [],
      })),
    },
    {
      id: "fixed-departures",
      label: "Salidas Fijas",
      href: "/fixed-departures",
      items: fixedDepartures.map((dep) => ({
        id: dep.id,
        title: dep.title,
        description: "Viajes programados con fechas fijas y precios especiales",
        imageUrl: getValidImageUrl(dep.heroImageUrl, FALLBACK_IMAGES.mountains),
        href: `/fixed-departures/${dep.slug}`,
        price: "$1200/persona",
        location: "Bolivia",
        amenities: dep.amenities || [],
        exclusions: dep.exclusions || [],
      })),
    },
    {
      id: "south-america",
      label: "Destinos Sudamericanos",
      href: "/destinations",
      items: allDestinations.map((dest) => ({
        id: dest.id,
        title: `${dest.city}, ${dest.country}`,
        description: "Descubre Sudamérica con nuestras rutas exclusivas",
        imageUrl: getValidImageUrl(dest.heroImageUrl, FALLBACK_IMAGES.beaches),
        href: `/destinations/${dest.slug}`,
        price: "$950/persona",
        location: `${dest.city}, ${dest.country}`,
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
            title="Descubre nuestros"
            subtitle="de viaje"
            description="Destinos increíbles, eventos únicos y experiencias inolvidables que se adaptan a tus sueños de viaje."
            animatedWords={["Destinos", "Aventuras", "Experiencias", "Sueños", "Momentos"]}
             backgroundImage="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80"
             animatedWordColor="text-wine"
             accentColor="bg-wine"
           />
        </section>

        {/* Search and Filters Section */}
        <section className="bg-white py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">
              Encuentra el mejor <span className="font-light italic">destino</span> de viaje
            </h2>
            <form method="get">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end w-full">
                <div>
                  <label className="block text-sm font-bold italic text-gray-700 mb-2">
                    Búsqueda
                  </label>
                                      <Input
                      className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl"
                      type="text"
                      name="q"
                      defaultValue={q}
                      placeholder="Buscar destinos..."
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
                                      <Button
                      type="submit"
                      className="h-12 w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium rounded-xl"
                    >
                      Buscar Destinos »
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
              {filteredDestinations.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-muted-foreground mb-6">
                    <Compass className="h-20 w-20 mx-auto mb-6 opacity-50" />
                    <h3 className="text-2xl font-semibold mb-3 text-foreground">
                      No se encontraron destinos
                    </h3>
                    <p className="text-lg max-w-md mx-auto text-muted-foreground">
                      Intenta ajustar tus filtros de búsqueda o consulta con
                      nosotros para crear un destino personalizado
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                      <Button asChild variant="outline">
                        <Link href="/contact">Contactar</Link>
                      </Button>
                      <WhatsAppCTA
                        template="Hola! Quiero información sobre destinos próximos."
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
                        {filteredDestinations.length} <span className="font-light italic">destino</span>{filteredDestinations.length !== 1 ? "s" : ""}{" "}
                        encontrado{filteredDestinations.length !== 1 ? "s" : ""}
                      </h2>
                      <p className="text-gray-600">
                        Resultados de tu búsqueda
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDestinations.map((destination) => (
                      <div key={destination.id} className="relative overflow-hidden rounded-lg group">
                        <Link href={`/destinations/${destination.slug}`} className="block">
                          <div className="relative h-64 sm:h-72">
                            <Image
                              src={destination.heroImageUrl && destination.heroImageUrl !== "1" && destination.heroImageUrl !== "null" ? destination.heroImageUrl : FALLBACK_IMAGES.destinations}
                              alt={getLocationText(destination)}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent p-6 flex flex-col justify-start">
                              <div>
                                <h2 className="text-white text-xl font-semibold uppercase">
                                  {getLocationText(destination)}
                                </h2>
                                <p className="text-white">Destino increíble</p>
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                              <div className="flex justify-between items-center">
                                <p className="text-white text-lg font-bold">
                                  Destino increíble
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
