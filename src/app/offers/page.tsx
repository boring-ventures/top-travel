import prisma from "@/lib/prisma";
import { getWhatsAppTemplateByUsage } from "@/lib/whatsapp-utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { AnimatedHero } from "@/components/ui/animated-hero";
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
  Tag,
  Filter,
  MapPin,
  Compass,
  ArrowRight,
  Star,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ClientWhatsAppCTA } from "@/components/utils/client-whatsapp-cta";

// Fallback images for different categories
const FALLBACK_IMAGES = {
  offers:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
  featured:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
  seasonal:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
  limited:
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80",
};

interface OffersPageProps {
  searchParams?: Promise<{
    q?: string;
    tagId?: string;
    isFeatured?: string;
    packageId?: string;
  }>;
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const params = await searchParams;
  const q = params?.q?.trim() || undefined;
  const tagId = params?.tagId || undefined;
  const isFeaturedParam = params?.isFeatured;
  const packageId = params?.packageId || undefined;
  const isFeatured =
    isFeaturedParam == null ? undefined : isFeaturedParam === "true";

  let featuredOffers: any[] = [];
  let regularOffers: any[] = [];
  let filteredOffers: any[] = [];
  let tags: any[] = [];
  let packages: any[] = [];
  let whatsappTemplates: any = {};

  // Check if there are active filters
  const hasActiveFilters =
    q ||
    (tagId && tagId !== "all") ||
    (isFeaturedParam && isFeaturedParam !== "all") ||
    (packageId && packageId !== "all");

  try {
    // Build where clause for filtered offers
    const where: any = {
      status: "PUBLISHED",
      isFeatured: isFeaturedParam === "all" ? undefined : isFeatured,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { subtitle: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(tagId && tagId !== "all" ? { offerTags: { some: { tagId } } } : {}),
      ...(packageId && packageId !== "all" ? { packageId } : {}),
    };

    const results = await Promise.all([
      // Featured offers
      prisma.offer.findMany({
        where: { status: "PUBLISHED", isFeatured: true },
        orderBy: { createdAt: "desc" },
        include: {
          package: {
            select: {
              id: true,
              title: true,
              slug: true,
              fromPrice: true,
              currency: true,
            },
          },
          offerTags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      // Regular offers
      prisma.offer.findMany({
        where: { status: "PUBLISHED", isFeatured: false },
        orderBy: { createdAt: "desc" },
        include: {
          package: {
            select: {
              id: true,
              title: true,
              slug: true,
              fromPrice: true,
              currency: true,
            },
          },
          offerTags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      // Filtered offers query
      hasActiveFilters
        ? prisma.offer.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 30,
            include: {
              package: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  fromPrice: true,
                  currency: true,
                },
              },
              offerTags: {
                include: {
                  tag: true,
                },
              },
            },
          })
        : Promise.resolve([]),
      prisma.tag.findMany({
        orderBy: { name: "asc" },
        where: {
          offerTags: {
            some: {},
          },
        },
      }),
      prisma.package.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { title: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      }),
    ]);
    [featuredOffers, regularOffers, filteredOffers, tags, packages] =
      results as any;

    // Fetch WhatsApp templates for different usage types
    whatsappTemplates = {
      offers: await getWhatsAppTemplateByUsage("OFFERS"),
      general: await getWhatsAppTemplateByUsage("GENERAL"),
    };
  } catch (err) {
    console.error("Offers data fetch failed", err);
  }

  // Helper functions
  const getValidImageUrl = (
    url: string | null | undefined,
    fallback: string
  ) => {
    if (!url || url === "1" || url === "null" || url === "undefined") {
      return fallback;
    }
    return url;
  };

  const formatPrice = (offer: any) => {
    if (offer.package?.fromPrice) {
      return `Desde $${offer.package.fromPrice}`;
    }
    return "Consultar precio";
  };

  // Offer card component
  const OfferCard = ({
    offer,
    isFeatured = false,
  }: {
    offer: any;
    isFeatured?: boolean;
  }) => (
    <div className="relative overflow-hidden rounded-2xl group">
      <div className="relative h-80 sm:h-96">
        <Image
          src={getValidImageUrl(offer.bannerImageUrl, FALLBACK_IMAGES.offers)}
          alt={offer.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Top Content */}
        <div className="absolute top-0 left-0 right-0 p-6">
          <div className="flex justify-between items-start">
            <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <p className="text-white text-sm font-medium">
                {offer.package?.title || "Oferta especial"}
              </p>
            </div>
            {isFeatured && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <span className="text-white text-xs font-bold flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  DESTACADA
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="space-y-4">
            <h2 className="text-white text-2xl font-bold font-serif drop-shadow-lg">
              {offer.title}
            </h2>
            {offer.subtitle && (
              <p className="text-white text-lg font-normal drop-shadow-lg">
                {offer.subtitle}
              </p>
            )}
            <p className="text-white text-lg font-semibold drop-shadow-lg">
              {formatPrice(offer)}
            </p>
            <Button
              asChild
              className="w-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center gap-2"
            >
              <Link href={`/offers/${offer.id}`}>
                <span>Ver oferta</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Section header component
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 mb-8">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <div className="h-px bg-gray-200 flex-1"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        {/* Hero Section */}
        <section className="relative">
          <AnimatedHero
            title="Aprovecha nuestras"
            subtitle="exclusivas"
            description="Ofertas limitadas en paquetes de viaje, eventos especiales y experiencias únicas. ¡No dejes pasar estas oportunidades increíbles!"
            animatedWords={["Ofertas", "Promociones", "Descuentos"]}
            backgroundImage="/images/hero/offers.jpg"
            animatedWordColor="text-white"
            accentColor="bg-blue-900"
          />
        </section>

        {/* Search and Filters Section */}
        <section className="bg-white py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-left">
              Encuentra la <span className="font-light italic">oferta</span>{" "}
              perfecta para ti
            </h2>
            <form method="get">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Búsqueda
                  </label>
                  <Input
                    className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl"
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Buscar ofertas..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paquete
                  </label>
                  <Select name="packageId" defaultValue={packageId || "all"}>
                    <SelectTrigger className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl">
                      <SelectValue placeholder="Seleccionar paquete" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los paquetes</SelectItem>
                      {packages.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Oferta
                  </label>
                  <Select
                    name="isFeatured"
                    defaultValue={isFeaturedParam || "all"}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las ofertas</SelectItem>
                      <SelectItem value="true">Destacadas</SelectItem>
                      <SelectItem value="false">Regulares</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <Select name="tagId" defaultValue={tagId || "all"}>
                    <SelectTrigger className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {tags.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="h-12 w-full bg-blue-900 text-white hover:bg-blue-950 transition-colors duration-200 font-medium rounded-xl"
                  >
                    Buscar Ofertas »
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
              {filteredOffers.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-muted-foreground mb-6">
                    <Compass className="h-20 w-20 mx-auto mb-6 opacity-50" />
                    <h3 className="text-2xl font-semibold mb-3 text-foreground">
                      No se encontraron ofertas
                    </h3>
                    <p className="text-lg max-w-md mx-auto text-muted-foreground">
                      Intenta ajustar tus filtros de búsqueda o consulta con
                      nosotros para ofertas personalizadas
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                      <Button asChild variant="outline">
                        <Link href="/contact">Contactar</Link>
                      </Button>
                      <ClientWhatsAppCTA
                        whatsappTemplate={
                          whatsappTemplates.offers
                            ? {
                                templateBody:
                                  whatsappTemplates.offers.templateBody,
                                phoneNumber:
                                  whatsappTemplates.offers.phoneNumber,
                                phoneNumbers:
                                  whatsappTemplates.offers.phoneNumbers,
                              }
                            : whatsappTemplates.general
                              ? {
                                  templateBody:
                                    whatsappTemplates.general.templateBody,
                                  phoneNumber:
                                    whatsappTemplates.general.phoneNumber,
                                  phoneNumbers:
                                    whatsappTemplates.general.phoneNumbers,
                                }
                              : undefined
                        }
                        template={
                          whatsappTemplates.offers?.templateBody ||
                          whatsappTemplates.general?.templateBody ||
                          "Hola! Quiero información sobre ofertas especiales."
                        }
                        variables={{
                          context: "ofertas",
                          searchQuery: q || "",
                        }}
                        campaign="offers_search"
                        content="no_results"
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
                        {filteredOffers.length}{" "}
                        <span className="font-light italic">oferta</span>
                        {filteredOffers.length !== 1 ? "s" : ""} encontrada
                        {filteredOffers.length !== 1 ? "s" : ""}
                      </h2>
                      <p className="text-gray-600">Resultados de tu búsqueda</p>
                    </div>
                    {isFeatured !== undefined && isFeatured && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-2 px-4 py-2 text-sm"
                      >
                        <Star className="h-4 w-4" />
                        Destacadas
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOffers.map((offer) => (
                      <div
                        key={offer.id}
                        className="relative overflow-hidden rounded-lg group"
                      >
                        <Link href={`/offers/${offer.id}`} className="block">
                          <div className="relative h-64 sm:h-72">
                            <Image
                              src={
                                offer.bannerImageUrl &&
                                offer.bannerImageUrl !== "1" &&
                                offer.bannerImageUrl !== "null"
                                  ? offer.bannerImageUrl
                                  : FALLBACK_IMAGES.offers
                              }
                              alt={offer.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent p-6 flex flex-col justify-start">
                              <div>
                                <h2 className="text-white text-xl font-semibold uppercase">
                                  {offer.title}
                                </h2>
                                {offer.subtitle && (
                                  <p className="text-white text-sm">
                                    {offer.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-6">
                              <div className="flex justify-between items-center">
                                <p className="text-white text-lg font-bold">
                                  {formatPrice(offer)}
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
          /* Offers Sections */
          <section className="py-12 w-full bg-white">
            <div className="container mx-auto px-4">
              {/* Ofertas Destacadas Section */}
              {featuredOffers.length > 0 && (
                <div className="mb-16">
                  <SectionHeader title="Ofertas Destacadas" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {featuredOffers.map((offer) => (
                      <OfferCard
                        key={offer.id}
                        offer={offer}
                        isFeatured={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Ofertas Regulares Section */}
              {regularOffers.length > 0 && (
                <div>
                  <SectionHeader title="Más Ofertas" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {regularOffers.map((offer) => (
                      <OfferCard
                        key={offer.id}
                        offer={offer}
                        isFeatured={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
