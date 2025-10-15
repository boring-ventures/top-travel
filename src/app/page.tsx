// Avoid next/head in App Router to prevent hydration mismatches
import {
  Header,
  Hero,
  TabbedContent,
  SpecialDepartments,
  WeddingDestinations,
  FeaturedOffers,
  Services,
  GlassCTA,
  Footer,
  PersistentWhatsAppCTA,
  Tags,
} from "@/components/views/landing-page";
import { World } from "@/components/ui/globe-client";
import { RotatingWords } from "@/components/ui/rotating-words";
import prisma from "@/lib/prisma";
import { filterValidImageUrls } from "@/lib/utils";
import { getWhatsAppTemplateByUsage } from "@/lib/whatsapp-utils";

export const metadata = {
  title: "GABYTOPTRAVEL – Viajes premium, eventos y experiencias",
  description:
    "Agencia de viajes boliviana: conciertos y eventos, Quinceañera, bodas de destino, destinos top y salidas fijas. Atención personalizada y logística segura.",
  icons: { icon: "/favicon.ico" },
};

// Force dynamic rendering to fetch fresh data on every request
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Fallback images for different categories - using placeholder API
const FALLBACK_IMAGES = {
  events: "/api/placeholder/400/300",
  destinations: "/api/placeholder/400/300",
  mountains: "/api/placeholder/400/300",
  beaches: "/api/placeholder/400/300",
  weddings: "/api/placeholder/400/300",
};

export default async function Home() {
  let offers: any[] = [];
  let topDestinations: any[] = [];
  let topPackages: any[] = [];
  let weddingDestinations: any[] = [];
  let featuredEvents: any[] = [];
  let departments: any[] = [];
  let fixedDepartures: any[] = [];
  let tags: any[] = [];
  let whatsappTemplates: any = {};

  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: -16.2902, lng: -63.5887 }, // Bolivia coordinates (La Paz)
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  // Bolivia coordinates (La Paz - main city)
  const boliviaLat = -16.2902;
  const boliviaLng = -63.5887;

  const boliviaArcs = [
    // From Bolivia to major world destinations
    {
      order: 1,
      startLat: boliviaLat,
      startLng: boliviaLng,
      endLat: 40.7128,
      endLng: -74.006, // New York
      arcAlt: 0.3,
      color: colors[0],
    },
    {
      order: 1,
      startLat: boliviaLat,
      startLng: boliviaLng,
      endLat: 51.5072,
      endLng: -0.1276, // London
      arcAlt: 0.4,
      color: colors[1],
    },
    {
      order: 1,
      startLat: boliviaLat,
      startLng: boliviaLng,
      endLat: 35.6762,
      endLng: 139.6503, // Tokyo
      arcAlt: 0.5,
      color: colors[2],
    },
    {
      order: 2,
      startLat: boliviaLat,
      startLng: boliviaLng,
      endLat: 22.3193,
      endLng: 114.1694, // Hong Kong
      arcAlt: 0.3,
      color: colors[0],
    },
    {
      order: 2,
      startLat: boliviaLat,
      startLng: boliviaLng,
      endLat: -33.8688,
      endLng: 151.2093, // Sydney
      arcAlt: 0.4,
      color: colors[1],
    },
    {
      order: 2,
      startLat: boliviaLat,
      startLng: boliviaLng,
      endLat: 48.8566,
      endLng: -2.3522, // Paris
      arcAlt: 0.3,
      color: colors[2],
    },
    {
      order: 3,
      startLat: boliviaLat,
      startLng: boliviaLng,
      endLat: 34.0522,
      endLng: -118.2437, // Los Angeles
      arcAlt: 0.2,
      color: colors[0],
    },
    {
      order: 3,
      startLat: boliviaLat,
      startLng: boliviaLng,
      endLat: 1.3521,
      endLng: 103.8198, // Singapore
      arcAlt: 0.4,
      color: colors[1],
    },
    {
      order: 3,
      startLat: boliviaLat,
      startLng: boliviaLng,
      endLat: 52.52,
      endLng: 13.405, // Berlin
      arcAlt: 0.3,
      color: colors[2],
    },
    // From major destinations to Bolivia
    {
      order: 4,
      startLat: 28.6139,
      startLng: 77.209, // New Delhi
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.5,
      color: colors[0],
    },
    {
      order: 4,
      startLat: -23.5505,
      startLng: -46.6333, // São Paulo
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.2,
      color: colors[1],
    },
    {
      order: 4,
      startLat: 19.4326,
      startLng: -99.1332, // Mexico City
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.3,
      color: colors[2],
    },
    {
      order: 5,
      startLat: 31.2304,
      startLng: 121.4737, // Shanghai
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.4,
      color: colors[0],
    },
    {
      order: 5,
      startLat: -34.6037,
      startLng: -58.3816, // Buenos Aires
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.2,
      color: colors[1],
    },
    {
      order: 5,
      startLat: 55.7558,
      startLng: 37.6176, // Moscow
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.6,
      color: colors[2],
    },
    {
      order: 6,
      startLat: 25.2048,
      startLng: 55.2708, // Dubai
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.5,
      color: colors[0],
    },
    {
      order: 6,
      startLat: -26.2041,
      startLng: 28.0473, // Johannesburg
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.4,
      color: colors[1],
    },
    {
      order: 6,
      startLat: 41.9028,
      startLng: 12.4964, // Rome
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.4,
      color: colors[2],
    },
    {
      order: 7,
      startLat: 37.5665,
      startLng: 126.978, // Seoul
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.5,
      color: colors[0],
    },
    {
      order: 7,
      startLat: 52.3676,
      startLng: 4.9041, // Amsterdam
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.4,
      color: colors[1],
    },
    {
      order: 7,
      startLat: 14.5995,
      startLng: 120.9842, // Manila
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.5,
      color: colors[2],
    },
    {
      order: 8,
      startLat: 30.0444,
      startLng: 31.2357, // Cairo
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.5,
      color: colors[0],
    },
    {
      order: 8,
      startLat: 49.2827,
      startLng: -123.1207, // Vancouver
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.3,
      color: colors[1],
    },
    {
      order: 8,
      startLat: -6.2088,
      startLng: 106.8456, // Jakarta
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.5,
      color: colors[2],
    },
    {
      order: 9,
      startLat: 21.3099,
      startLng: -157.8581, // Honolulu
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.4,
      color: colors[0],
    },
    {
      order: 9,
      startLat: 59.9311,
      startLng: 10.7579, // Oslo
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.5,
      color: colors[1],
    },
    {
      order: 9,
      startLat: 12.9716,
      startLng: 77.5946, // Bangalore
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.5,
      color: colors[2],
    },
    {
      order: 10,
      startLat: 39.9042,
      startLng: 116.4074, // Beijing
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.5,
      color: colors[0],
    },
    {
      order: 10,
      startLat: 25.7617,
      startLng: -80.1918, // Miami
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.3,
      color: colors[1],
    },
    {
      order: 10,
      startLat: 33.6844,
      startLng: 73.0479, // Islamabad
      endLat: boliviaLat,
      endLng: boliviaLng,
      arcAlt: 0.5,
      color: colors[2],
    },
  ];

  try {
    const results = await Promise.all([
      prisma.offer.findMany({
        where: { status: "PUBLISHED", isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          subtitle: true,
          bannerImageUrl: true,
          externalUrl: true,
          package: {
            select: {
              slug: true,
              title: true,
              fromPrice: true,
              currency: true,
              summary: true,
            },
          },
        },
      }),
      prisma.destination.findMany({
        where: {
          destinationTags: {
            some: {
              tag: {
                slug: "top-destinations",
              },
            },
          },
        },
        take: 6,
        select: {
          id: true,
          slug: true,
          city: true,
          country: true,
          heroImageUrl: true,
        },
      }),
      prisma.package.findMany({
        where: {
          status: "PUBLISHED",
          isTop: true,
        },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          heroImageUrl: true,
          fromPrice: true,
          currency: true,
          packageDestinations: {
            select: {
              destination: {
                select: {
                  city: true,
                  country: true,
                },
              },
            },
            take: 1,
          },
        },
      }),
      prisma.weddingDestination.findMany({
        where: {
          isFeatured: true,
        },
        take: 6,
        select: {
          id: true,
          slug: true,
          name: true,
          title: true,
          description: true,
          heroImageUrl: true,
          isFeatured: true,
        },
      }),
      prisma.event.findMany({
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
          destination: {
            select: {
              city: true,
              country: true,
            },
          },
        },
      }),
      prisma.department.findMany({
        select: {
          id: true,
          type: true,
          title: true,
          heroImageUrl: true,
          themeJson: true,
        },
      }),
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
      prisma.tag.findMany({
        orderBy: [{ type: "asc" }, { name: "asc" }],
        include: {
          _count: {
            select: {
              packageTags: true,
              destinationTags: true,
            },
          },
        },
        take: 12,
      }),
    ]);
    [
      offers,
      topDestinations,
      topPackages,
      weddingDestinations,
      featuredEvents,
      departments,
      fixedDepartures,
      tags,
    ] = results as any;

    // Convert Decimal objects to numbers for client components
    offers = offers.map((offer) => ({
      ...offer,
      package: offer.package
        ? {
            ...offer.package,
            fromPrice: offer.package.fromPrice
              ? Number(offer.package.fromPrice)
              : undefined,
          }
        : undefined,
    }));

    // Convert Decimal objects to numbers for top packages
    topPackages = topPackages.map((pkg) => ({
      ...pkg,
      fromPrice: pkg.fromPrice ? Number(pkg.fromPrice) : undefined,
    }));

    // Fetch WhatsApp templates for different usage types
    whatsappTemplates = {
      offers: await getWhatsAppTemplateByUsage("OFFERS"),
      destinations: await getWhatsAppTemplateByUsage("DESTINATIONS"),
      general: await getWhatsAppTemplateByUsage("GENERAL"),
    };
  } catch (err) {
    console.error("Home data fetch failed", err);
  }

  // No fallback to mock data - only use real database data

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

  // Prepare hero items
  const heroItems = (
    [
      // Prioritize the first featured offer for hero background
      ...filterValidImageUrls(offers, "bannerImageUrl")
        .slice(0, 1)
        .map((o) => ({
          src: getValidImageUrl(o.bannerImageUrl, FALLBACK_IMAGES.destinations),
          title: o.title,
          href: o.package?.slug
            ? `/packages/${o.package.slug}`
            : o.externalUrl || "#",
          subtitle: o.subtitle || undefined,
        })),
      // Add remaining offers and destinations
      ...filterValidImageUrls(offers, "bannerImageUrl")
        .slice(1)
        .map((o) => ({
          src: getValidImageUrl(o.bannerImageUrl, FALLBACK_IMAGES.destinations),
          title: o.title,
          href: o.package?.slug
            ? `/packages/${o.package.slug}`
            : o.externalUrl || "#",
          subtitle: o.subtitle || undefined,
        })),
      ...filterValidImageUrls(topDestinations, "heroImageUrl").map((d) => ({
        src: getValidImageUrl(d.heroImageUrl, FALLBACK_IMAGES.destinations),
        title: `${d.city}, ${d.country}`,
        href: `/destinations/${d.slug}`,
      })),
    ] as { src: string; title: string; href: string; subtitle?: string }[]
  ).slice(0, 6);

  // Prepare tabbed content data
  const tabbedContent = [
    {
      id: "destinations",
      label: "Destinos Top",
      href: "/packages",
      items: topPackages.slice(0, 6).map((pkg) => ({
        id: pkg.id,
        title: pkg.title,
        description:
          pkg.summary ||
          "Explora destinos increíbles con nuestras experiencias únicas",
        imageUrl: getValidImageUrl(
          pkg.heroImageUrl,
          FALLBACK_IMAGES.destinations
        ),
        href: `/packages/${pkg.slug}`,
        price: pkg.fromPrice
          ? `${pkg.currency || "USD"} ${pkg.fromPrice.toLocaleString()}`
          : "Consultar precio",
        location: pkg.packageDestinations?.[0]?.destination
          ? `${pkg.packageDestinations[0].destination.city}, ${pkg.packageDestinations[0].destination.country}`
          : "Bolivia",
        isTop: true,
      })),
    },
    {
      id: "events",
      label: "Conciertos & Eventos",
      href: "/events",
      items: featuredEvents.slice(0, 6).map((event) => ({
        id: event.id,
        title: event.title,
        description: `${event.locationCity}, ${event.locationCountry}`,
        imageUrl: getValidImageUrl(event.heroImageUrl, FALLBACK_IMAGES.events),
        href: `/events/${event.slug}`,
        price: "Consultar precio",
        location: `${event.locationCity}, ${event.locationCountry}`,
        amenities: event.amenities || [],
        exclusions: event.exclusions || [],
      })),
    },
    {
      id: "fixed-departures",
      label: "Salidas Fijas",
      href: "/fixed-departures",
      items: fixedDepartures.slice(0, 6).map((dep) => ({
        id: dep.id,
        title: dep.title,
        description: "Viajes programados con fechas fijas y precios especiales",
        imageUrl: getValidImageUrl(dep.heroImageUrl, FALLBACK_IMAGES.mountains),
        href: `/fixed-departures/${dep.slug}`,
        price: "Consultar precio",
        location: "Bolivia",
        amenities: dep.amenities || [],
        exclusions: dep.exclusions || [],
      })),
    },
  ];

  // Prepare special departments data
  const specialDepartments = [
    {
      id: "weddings",
      title: "Bodas de Destino",
      description:
        "Planifica tu boda soñada con nuestro equipo experto, asegurando una celebración sin problemas e inolvidable en los destinos más románticos.",
      imageUrl: FALLBACK_IMAGES.weddings,
      href: "/weddings",
      price: "Consultar precio",
    },
    {
      id: "quinceanera",
      title: "Quinceañeras",
      description:
        "Celebra tu 15 cumpleaños especial con un tour diseñado personalmente, creando recuerdos duraderos en destinos mágicos.",
      imageUrl: FALLBACK_IMAGES.weddings,
      href: "/quinceanera",
      price: "Consultar precio",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        <Hero items={heroItems} tags={tags} />

        <FeaturedOffers
          offers={offers}
          whatsappTemplate={whatsappTemplates.offers}
        />

        {/* Tabbed Content Section */}
        <section className="py-16 w-full bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-corporate-blue mb-4">
                Descubre las{" "}
                <span className="font-bold text-blue-600">Maravillas</span> del
                mundo
              </h2>
            </div>
            <TabbedContent tabs={tabbedContent} />
          </div>
        </section>

        {/* Experiences Section */}
        <section className="py-4 sm:py-6 w-full bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left side - Text content */}
              <div className="text-left order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                  En GabyTopTravel las{" "}
                  <span className="font-bold text-white">experiencias</span> son
                  <br />
                  <RotatingWords
                    words={["Únicas", "Inolvidables", "Extraordinarias"]}
                    interval={2500}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold italic text-blue-700"
                  />
                </h2>
              </div>

              {/* Right side - Globe component */}
              <div className="relative order-1 lg:order-2">
                <World globeConfig={globeConfig} data={boliviaArcs} />
              </div>
            </div>
          </div>
        </section>

        {/* Wedding Destinations Section */}
        <WeddingDestinations destinations={weddingDestinations} />

        <Tags tags={tags} />

        {/* Services Section */}
        <Services />

        {/* Glass CTA Section */}
        <GlassCTA
          whatsappTemplate={whatsappTemplates.general}
          fallbackPhone="+59169671000"
        />
      </main>

      <PersistentWhatsAppCTA
        whatsappTemplate={whatsappTemplates.general}
        fallbackPhone="+59169671000"
      />
      <Footer />
    </div>
  );
}
