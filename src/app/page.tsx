// Avoid next/head in App Router to prevent hydration mismatches
import {
  Header,
  Hero,
  CustomizablePackages,
  TabbedContent,
  SpecialDepartments,
  FeaturedOffers,
  About,
  Testimonials,
  Footer,
  PersistentWhatsAppCTA,
} from "@/components/views/landing-page";
import TagCloud from "@/components/views/landing-page/TagCloud";
import prisma from "@/lib/prisma";
import { filterValidImageUrls } from "@/lib/utils";
import { getWhatsAppTemplateByUsage } from "@/lib/whatsapp-utils";

export const metadata = {
  title: "GABYTOPTRAVEL – Viajes premium, eventos y experiencias",
  description:
    "Agencia de viajes boliviana: conciertos y eventos, Quinceañera, bodas de destino, destinos top y salidas fijas. Atención personalizada y logística segura.",
  icons: { icon: "/favicon.ico" },
};

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
  weddings:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80",
  testimonials:
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80",
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
  offers: [
    {
      id: "1",
      title: "Beach Getaway",
      subtitle: "Relax on the beautiful beaches of Brazil",
      bannerImageUrl: FALLBACK_IMAGES.beaches,
    },
    {
      id: "2",
      title: "Mountain Adventure",
      subtitle: "Explore the stunning mountains of Peru",
      bannerImageUrl: FALLBACK_IMAGES.mountains,
    },
    {
      id: "3",
      title: "City Exploration",
      subtitle: "Discover the vibrant cities of Argentina",
      bannerImageUrl: FALLBACK_IMAGES.destinations,
    },
  ],
  testimonials: [
    {
      id: "1",
      authorName: "Olivia S.",
      content:
        "GabyTop Travel made our wedding planning stress-free and the celebration was perfect!",
      rating: 5,
      location: "La Paz, Bolivia",
      imageUrl: FALLBACK_IMAGES.testimonials,
    },
    {
      id: "2",
      authorName: "Ethan L.",
      content:
        "The quinceañera tour was a dream come true for my daughter. Thank you!",
      rating: 5,
      location: "Santa Cruz, Bolivia",
      imageUrl: FALLBACK_IMAGES.testimonials,
    },
    {
      id: "3",
      authorName: "Sophia R.",
      content:
        "Our family vacation was unforgettable, thanks to the personalized service and expert recommendations.",
      rating: 5,
      location: "Cochabamba, Bolivia",
      imageUrl: FALLBACK_IMAGES.testimonials,
    },
  ],
};

export default async function Home() {
  let offers: any[] = [];
  let topDestinations: any[] = [];
  let featuredEvents: any[] = [];
  let departments: any[] = [];
  let fixedDepartures: any[] = [];
  let testimonials: any[] = [];
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
          displayTag: true,
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
        where: { isFeatured: true },
        take: 6,
        select: {
          id: true,
          slug: true,
          city: true,
          country: true,
          heroImageUrl: true,
          displayTag: true,
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
          startDate: true,
          endDate: true,
        },
      }),
      prisma.testimonial.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          authorName: true,
          location: true,
          rating: true,
          content: true,
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
      featuredEvents,
      departments,
      fixedDepartures,
      testimonials,
      tags,
    ] = results as any;

    // Fetch WhatsApp templates for different usage types
    whatsappTemplates = {
      offers: await getWhatsAppTemplateByUsage("OFFERS"),
      destinations: await getWhatsAppTemplateByUsage("DESTINATIONS"),
      general: await getWhatsAppTemplateByUsage("GENERAL"),
    };
  } catch (err) {
    console.error("Home data fetch failed", err);
  }

  // Use default data if no data from database
  if (!offers.length) offers = DEFAULT_DATA.offers;
  if (!topDestinations.length) topDestinations = DEFAULT_DATA.destinations;
  if (!featuredEvents.length) featuredEvents = DEFAULT_DATA.events;
  if (!testimonials.length) testimonials = DEFAULT_DATA.testimonials;

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
      items: featuredEvents.slice(0, 3).map((event) => ({
        id: event.id,
        title: event.title,
        description: `${event.locationCity}, ${event.locationCountry}`,
        imageUrl: FALLBACK_IMAGES.events,
        href: `/events/${event.slug}`,
        price: "$150/persona",
        location: `${event.locationCity}, ${event.locationCountry}`,
      })),
    },
    {
      id: "destinations",
      label: "Destinos Top",
      href: "/destinations",
      items: topDestinations.slice(0, 3).map((dest) => ({
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
      id: "fixed-departures",
      label: "Salidas Fijas",
      href: "/fixed-departures",
      items: fixedDepartures.slice(0, 3).map((dep) => ({
        id: dep.id,
        title: dep.title,
        description: "Viajes programados con fechas fijas y precios especiales",
        imageUrl: FALLBACK_IMAGES.mountains,
        href: `/fixed-departures/${dep.slug}`,
        price: "$1200/persona",
        location: "Bolivia",
      })),
    },
    {
      id: "south-america",
      label: "Destinos Sudamericanos",
      href: "/destinations",
      items: topDestinations.slice(0, 3).map((dest) => ({
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

  // Prepare special departments data
  const specialDepartments = [
    {
      id: "weddings",
      title: "Bodas de Destino",
      description:
        "Planifica tu boda soñada con nuestro equipo experto, asegurando una celebración sin problemas e inolvidable en los destinos más románticos.",
      imageUrl: FALLBACK_IMAGES.weddings,
      href: "/weddings",
      price: "Desde $5000",
    },
    {
      id: "quinceanera",
      title: "Quinceañeras",
      description:
        "Celebra tu 15 cumpleaños especial con un tour diseñado personalmente, creando recuerdos duraderos en destinos mágicos.",
      imageUrl: FALLBACK_IMAGES.weddings,
      href: "/quinceanera",
      price: "Desde $3000",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative pt-16 sm:pt-20">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        <Hero items={heroItems} featuredOffer={offers[0]} />
        <CustomizablePackages />
        <TabbedContent tabs={tabbedContent} />

        {/* Popular Tags Section */}
        {tags.length > 0 && (
          <section className="py-16 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Explorar por Etiquetas
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Descubre contenido organizado por categorías. Haz clic en
                  cualquier etiqueta para ver todo el contenido relacionado.
                </p>
              </div>
              <TagCloud
                tags={tags}
                showCounts={true}
                maxTags={12}
                className="justify-center"
              />
              <div className="text-center mt-8">
                <a
                  href="/tags"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  Ver todas las etiquetas
                  <svg
                    className="w-4 h-4"
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
                </a>
              </div>
            </div>
          </section>
        )}

        <SpecialDepartments departments={specialDepartments} />
        <FeaturedOffers
          offers={offers}
          whatsappTemplate={whatsappTemplates.offers}
        />
        <About />
        <Testimonials items={testimonials} />
      </main>

      <PersistentWhatsAppCTA whatsappTemplate={whatsappTemplates.general} />
      <Footer />
    </div>
  );
}
