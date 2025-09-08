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
  GlobeDemo,
} from "@/components/views/landing-page";
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
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Descubre las{" "}
                <span className="font-bold text-blue-600">Maravillas</span> del
                mundo
              </h2>
            </div>
            <TabbedContent tabs={tabbedContent} />
          </div>
        </section>

        {/* Experiences Section */}
        <section className="py-16 w-full bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <div className="text-left">
                <h2 className="text-5xl font-bold mb-6">
                  En GabyTopTravel las{" "}
                  <span className="font-bold text-blue-400">experiencias</span>{" "}
                  son <span className="font-bold text-blue-400">Únicas</span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Descubre el mundo con nosotros y vive aventuras que
                  transformarán tu perspectiva. Cada viaje es una historia única
                  esperando ser contada.
                </p>
              </div>

              {/* Right side - Globe component */}
              <div className="relative">
                <GlobeDemo />
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
