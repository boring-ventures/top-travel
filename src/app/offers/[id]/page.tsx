import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getWhatsAppTemplateByUsage } from "@/lib/whatsapp-utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  ArrowLeft,
  ExternalLink,
  Tag,
  Users,
  Plane,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";

interface OfferPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Fallback images for different categories
const FALLBACK_IMAGES = {
  offers:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
  featured:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  seasonal:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  limited:
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
};

export default async function OfferPage({ params }: OfferPageProps) {
  const { id } = await params;

  let offer: any = null;
  let whatsappTemplates: any = {};

  try {
    // Fetch the specific offer with all related data
    offer = await prisma.offer.findUnique({
      where: {
        id: id,
        status: "PUBLISHED",
      },
      include: {
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            fromPrice: true,
            currency: true,
            summary: true,
            durationDays: true,
            packageDestinations: {
              include: {
                destination: {
                  select: {
                    id: true,
                    city: true,
                    country: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        offerTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                type: true,
              },
            },
          },
        },
      },
    });

    // Get WhatsApp templates
    whatsappTemplates = await getWhatsAppTemplateByUsage("GENERAL");
  } catch (error) {
    console.error("Error fetching offer:", error);
  }

  if (!offer) {
    notFound();
  }

  // Determine the image to use
  const getOfferImage = () => {
    if (offer.bannerImageUrl) {
      return offer.bannerImageUrl;
    }

    // Use fallback based on tags or featured status
    if (offer.isFeatured) {
      return FALLBACK_IMAGES.featured;
    }

    // Check for seasonal or limited tags
    const hasSeasonalTag = offer.offerTags?.some(
      (ot: any) =>
        ot.tag?.name?.toLowerCase().includes("seasonal") ||
        ot.tag?.name?.toLowerCase().includes("temporada")
    );

    if (hasSeasonalTag) {
      return FALLBACK_IMAGES.seasonal;
    }

    return FALLBACK_IMAGES.offers;
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === "USD") {
      return `$${price.toLocaleString()}`;
    }
    return `Bs ${price.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const isOfferActive = () => {
    if (!offer.startAt && !offer.endAt) return true;

    const now = new Date();
    const startDate = offer.startAt ? new Date(offer.startAt) : null;
    const endDate = offer.endAt ? new Date(offer.endAt) : null;

    if (startDate && endDate) {
      return now >= startDate && now <= endDate;
    }
    if (startDate) {
      return now >= startDate;
    }
    if (endDate) {
      return now <= endDate;
    }

    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Ofertas
          </Link>
        </div>

        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-96 lg:h-[500px] overflow-hidden">
            <Image
              src={getOfferImage()}
              alt={offer.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />

            {/* Featured Badge */}
            {offer.isFeatured && (
              <div className="absolute top-6 left-6">
                <Badge className="bg-yellow-500 text-white px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Destacada
                </Badge>
              </div>
            )}

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 pb-8">
                <div className="max-w-4xl">
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                    {offer.title}
                  </h1>
                  {offer.subtitle && (
                    <p className="text-xl lg:text-2xl text-gray-200 mb-6">
                      {offer.subtitle}
                    </p>
                  )}

                  {/* Tags */}
                  {offer.offerTags && offer.offerTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {offer.offerTags.map((offerTag: any) => (
                        <Badge
                          key={offerTag.tag.id}
                          variant="secondary"
                          className="bg-white/20 text-white border-white/30"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {offerTag.tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Date Range */}
                  {(offer.startAt || offer.endAt) && (
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm">
                          {offer.startAt && formatDate(offer.startAt)}
                          {offer.startAt && offer.endAt && " - "}
                          {offer.endAt && formatDate(offer.endAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span className="text-sm">
                          {isOfferActive() ? "Activa" : "Expirada"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Package Information */}
                {offer.package && (
                  <Card className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {offer.package.title}
                        </h2>
                        {offer.package.summary && (
                          <p className="text-gray-600 text-lg">
                            {offer.package.summary}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-corporate-blue">
                          {formatPrice(
                            offer.package.fromPrice,
                            offer.package.currency
                          )}
                        </div>
                        <div className="text-sm text-gray-500">desde</div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {offer.package.durationDays && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-gray-900">
                              Duración
                            </div>
                            <div className="text-sm text-gray-600">
                              {offer.package.durationDays} días
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Plane className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900">Tipo</div>
                          <div className="text-sm text-gray-600">
                            Paquete incluido
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Destinations */}
                    {offer.package.packageDestinations &&
                      offer.package.packageDestinations.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Destinos Incluidos
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {offer.package.packageDestinations.map(
                              (pkgDest: any) => (
                                <Badge
                                  key={pkgDest.destination.id}
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  <MapPin className="h-3 w-3" />
                                  {pkgDest.destination.city},{" "}
                                  {pkgDest.destination.country}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        asChild
                        size="lg"
                        className="flex-1 bg-corporate-blue hover:bg-corporate-blue/90"
                      >
                        <Link href={`/packages/${offer.package.slug}`}>
                          Ver Detalles del Paquete
                        </Link>
                      </Button>

                      <WhatsAppCTA
                        template="Hola! Me interesa la oferta {title}. ¿Podrían darme más información?"
                        variables={{ title: offer.title }}
                        label="Consultar por WhatsApp"
                        phone="+59175651451"
                        size="lg"
                        className="flex-1"
                      />
                    </div>
                  </Card>
                )}

                {/* External URL Offer */}
                {offer.externalUrl && (
                  <Card className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Oferta Externa
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Esta oferta está disponible en nuestro sitio externo
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-corporate-blue hover:bg-corporate-blue/90"
                    >
                      <Link
                        href={offer.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Oferta Externa
                      </Link>
                    </Button>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Offer Status */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Estado de la Oferta
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <Badge
                        variant={isOfferActive() ? "default" : "secondary"}
                        className={
                          isOfferActive() ? "bg-green-500" : "bg-gray-500"
                        }
                      >
                        {isOfferActive() ? "Activa" : "Expirada"}
                      </Badge>
                    </div>

                    {offer.startAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Inicio:</span>
                        <span className="text-sm font-medium">
                          {formatDate(offer.startAt)}
                        </span>
                      </div>
                    )}

                    {offer.endAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Fin:</span>
                        <span className="text-sm font-medium">
                          {formatDate(offer.endAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Quick Contact */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ¿Necesitas Ayuda?
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Nuestro equipo está listo para ayudarte con cualquier
                    pregunta sobre esta oferta.
                  </p>
                  <WhatsAppCTA
                    template="Hola! Tengo una pregunta sobre la oferta {title}."
                    variables={{ title: offer.title }}
                    label="Chatear por WhatsApp"
                    phone="+59175651451"
                    size="sm"
                    className="w-full"
                  />
                </Card>

                {/* Related Tags */}
                {offer.offerTags && offer.offerTags.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Categorías
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {offer.offerTags.map((offerTag: any) => (
                        <Badge
                          key={offerTag.tag.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {offerTag.tag.name}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
