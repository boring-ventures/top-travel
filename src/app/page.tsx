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
// import { World } from "@/components/ui/globe-client";
import { RotatingWords } from "@/components/ui/rotating-words";
import MetricsSection from "@/components/views/landing-page/MetricsSection";
import prisma from "@/lib/prisma";
import { filterValidImageUrls } from "@/lib/utils";
import { getWhatsAppTemplateByUsage } from "@/lib/whatsapp-utils";

export const metadata = {
  title: "GABYTOPTRAVEL – Viajes premium, eventos y experiencias",
  description:
    "Agencia de viajes boliviana: conciertos y eventos, Quinceañera, bodas de destino, destinos top y salidas fijas. Atención personalizada y logística segura.",
  icons: { icon: "/favicon.ico" },
};

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
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: -15.785493,
      startLng: -47.909029,
      endLat: 36.162809,
      endLng: -115.119411,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: -34.6037,
      startLng: -58.3816,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 14.5995,
      startLng: 120.9842,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: -15.432563,
      startLng: 28.315853,
      endLat: 1.094136,
      endLng: -63.34546,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 37.5665,
      startLng: 126.978,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 48.8566,
      startLng: -2.3522,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: -8.833221,
      startLng: 13.264837,
      endLat: -33.936138,
      endLng: 18.436529,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 49.2827,
      startLng: -123.1207,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: 28.6139,
      endLng: 77.209,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 41.9028,
      startLng: 12.4964,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 14,
      startLat: -33.936138,
      startLng: 18.436529,
      endLat: 21.395643,
      endLng: 39.883798,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
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
          locationCity: true,
          locationCountry: true,
          heroImageUrl: true,
          amenities: true,
          exclusions: true,
          startDate: true,
          endDate: true,
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
      id: "destinations",
      label: "Destinos Top",
      href: "/tags/top-destinations",
      items: topDestinations.slice(0, 6).map((dest) => ({
        id: dest.id,
        title: `${dest.city}, ${dest.country}`,
        description:
          "Explora destinos increíbles con nuestras experiencias únicas",
        imageUrl: getValidImageUrl(
          dest.heroImageUrl,
          FALLBACK_IMAGES.destinations
        ),
        href: `/destinations/${dest.slug}`,
        price: "Consultar precio",
        location: `${dest.city}, ${dest.country}`,
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
    {
      id: "south-america",
      label: "Destinos Sudamericanos",
      href: "/destinations",
      items: topDestinations.slice(0, 6).map((dest) => ({
        id: dest.id,
        title: `${dest.city}, ${dest.country}`,
        description: "Descubre Sudamérica con nuestras rutas exclusivas",
        imageUrl: getValidImageUrl(dest.heroImageUrl, FALLBACK_IMAGES.beaches),
        href: `/destinations/${dest.slug}`,
        price: "Consultar precio",
        location: `${dest.city}, ${dest.country}`,
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

        {/* Metrics Section */}
        <MetricsSection />

        {/* Tabbed Content Section */}
        <section className="py-16 w-full bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Descubre las{" "}
                <span className="font-bold text-blue-600">Maravillas</span> del
                mundo
              </h2>
            </div>
            <TabbedContent tabs={tabbedContent} />
          </div>
        </section>

        {/* Experiences Section */}
        <section className="py-8 sm:py-16 w-full bg-gray-900 text-white">
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
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-700"
                  />
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                  Descubre el mundo con nosotros y vive aventuras que
                  transformarán tu perspectiva. Cada viaje es una historia única
                  esperando ser contada.
                </p>
              </div>

              {/* Right side - Globe component */}
              <div className="relative order-1 lg:order-2">
                {/* <World globeConfig={globeConfig} data={sampleArcs} /> */}
                <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-gray-500">
                    Globe component temporarily disabled
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wedding Destinations Section */}
        <WeddingDestinations destinations={weddingDestinations} />

        <FeaturedOffers
          offers={offers}
          whatsappTemplate={whatsappTemplates.offers}
        />
        <Tags tags={tags} />

        {/* Services Section */}
        <Services />

        {/* Glass CTA Section */}
        <GlassCTA whatsappTemplate={whatsappTemplates.general} />
      </main>

      <PersistentWhatsAppCTA whatsappTemplate={whatsappTemplates.general} />
      <Footer />
    </div>
  );
}
