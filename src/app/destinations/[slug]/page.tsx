import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPriceWithCurrency } from "@/lib/currency-utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { PdfSection } from "@/components/ui/pdf-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Star,
  ArrowLeft,
  Globe,
  Info,
  Calendar,
  Music,
  Tag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ClientWhatsAppCTA } from "@/components/utils/client-whatsapp-cta";
import { getWhatsAppTemplateByUsage } from "@/lib/whatsapp-utils";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DestinationPage({
  params,
}: DestinationPageProps) {
  const { slug } = await params;

  // Fetch WhatsApp template for destinations
  const whatsappTemplate = await getWhatsAppTemplateByUsage("DESTINATIONS");

  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: {
      destinationTags: {
        include: {
          tag: true,
        },
      },
      packageDestinations: {
        include: {
          package: {
            select: {
              id: true,
              title: true,
              slug: true,
              fromPrice: true,
              currency: true,
              heroImageUrl: true,
            },
          },
        },
      },
      fixedDepartures: {
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          slug: true,
          startDate: true,
          endDate: true,
          heroImageUrl: true,
        },
        orderBy: { startDate: "asc" },
        take: 6,
      },
      events: {
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          slug: true,
          artistOrEvent: true,
          startDate: true,
          endDate: true,
          heroImageUrl: true,
          fromPrice: true,
          currency: true,
          venue: true,
        },
        orderBy: { startDate: "asc" },
        take: 6,
      },
      offers: {
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          subtitle: true,
          bannerImageUrl: true,
          startAt: true,
          endAt: true,
          isFeatured: true,
          externalUrl: true,
          package: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
    },
  });

  if (!destination) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[60vh] min-h-[400px] sm:h-[70vh] lg:h-[80vh]">
            <Image
              src={
                destination.heroImageUrl &&
                destination.heroImageUrl !== "1" &&
                destination.heroImageUrl !== "null"
                  ? destination.heroImageUrl
                  : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80"
              }
              alt={`${destination.city}, ${destination.country}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Navigation */}
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Link
                    href="/destinations"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Volver a destinos</span>
                    <span className="sm:hidden">Volver</span>
                  </Link>
                </Button>

                {destination.isFeatured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 backdrop-blur-md">
                    <Star className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">DESTACADO</span>
                    <span className="sm:hidden">★</span>
                  </Badge>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
              <div className="max-w-6xl mx-auto">
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
                    {destination.city}
                  </h1>
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl drop-shadow-lg">
                      {destination.country}
                    </span>
                  </div>
                  {destination.description && (
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl drop-shadow-lg">
                      {destination.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-8 sm:py-12 lg:py-16 w-full bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                  {/* Tags */}
                  {destination.destinationTags &&
                    destination.destinationTags.length > 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                          Categorías
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {destination.destinationTags.map((destinationTag) => (
                            <Badge
                              key={destinationTag.tag.id}
                              variant="outline"
                              className="text-sm px-3 py-1"
                            >
                              {destinationTag.tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Related Packages */}
                  {destination.packageDestinations &&
                    destination.packageDestinations.length > 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                          Paquetes disponibles
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {destination.packageDestinations.map(
                            (packageDestination) => (
                              <Link
                                key={packageDestination.package.id}
                                href={`/packages/${packageDestination.package.slug}`}
                                className="group block"
                              >
                                <div className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                                  <div className="flex items-center gap-3">
                                    {packageDestination.package
                                      .heroImageUrl && (
                                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                          src={
                                            packageDestination.package
                                              .heroImageUrl
                                          }
                                          alt={packageDestination.package.title}
                                          width={64}
                                          height={64}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <h4 className="font-medium group-hover:text-blue-600 transition-colors">
                                        {packageDestination.package.title}
                                      </h4>
                                      {packageDestination.package.fromPrice && (
                                        <p className="text-sm text-muted-foreground">
                                          Desde $
                                          {packageDestination.package.fromPrice.toString()}{" "}
                                          {packageDestination.package.currency}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Fixed Departures */}
                  {destination.fixedDepartures &&
                    destination.fixedDepartures.length > 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                          Salidas fijas
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {destination.fixedDepartures.map((departure) => (
                            <Link
                              key={departure.id}
                              href={`/fixed-departures/${departure.slug}`}
                              className="group block"
                            >
                              <div className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-green-300">
                                <div className="flex items-center gap-3">
                                  {departure.heroImageUrl && (
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                      <Image
                                        src={departure.heroImageUrl}
                                        alt={departure.title}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <h4 className="font-medium group-hover:text-green-600 transition-colors">
                                      {departure.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {new Intl.DateTimeFormat("es-ES", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }).format(
                                        new Date(departure.startDate)
                                      )}{" "}
                                      -{" "}
                                      {new Intl.DateTimeFormat("es-ES", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }).format(new Date(departure.endDate))}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Events */}
                  {destination.events && destination.events.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Music className="h-5 w-5 text-purple-600" />
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Eventos y conciertos
                          </h3>
                        </div>
                        <Link
                          href="/events"
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Ver todos →
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {destination.events.map((event) => (
                          <Link
                            key={event.id}
                            href={`/events/${event.slug}`}
                            className="group block"
                          >
                            <div className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-purple-300">
                              <div className="flex items-center gap-3">
                                {event.heroImageUrl && (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                      src={event.heroImageUrl}
                                      alt={event.title}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h4 className="font-medium group-hover:text-purple-600 transition-colors">
                                    {event.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {event.artistOrEvent}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {new Intl.DateTimeFormat("es-ES", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }).format(new Date(event.startDate))}
                                    </span>
                                    {event.venue && (
                                      <>
                                        <span>•</span>
                                        <span>{event.venue}</span>
                                      </>
                                    )}
                                  </div>
                                  {event.fromPrice && (
                                    <p className="text-sm font-medium text-green-600 mt-1">
                                      Desde{" "}
                                      {formatPriceWithCurrency(
                                        event.fromPrice,
                                        event.currency,
                                        false
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Offers */}
                  {destination.offers && destination.offers.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Tag className="h-5 w-5 text-orange-600" />
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Ofertas especiales
                          </h3>
                        </div>
                        <Link
                          href="/offers"
                          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Ver todas →
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {destination.offers.map((offer) => (
                          <div key={offer.id} className="group block">
                            {offer.package ? (
                              <Link
                                href={`/packages/${offer.package.slug}`}
                                className="block"
                              >
                                <div className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-orange-300">
                                  <div className="flex items-center gap-3">
                                    {offer.bannerImageUrl && (
                                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                          src={offer.bannerImageUrl}
                                          alt={offer.title}
                                          width={64}
                                          height={64}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium group-hover:text-orange-600 transition-colors">
                                          {offer.title}
                                        </h4>
                                        {offer.isFeatured && (
                                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                                            Destacado
                                          </Badge>
                                        )}
                                      </div>
                                      {offer.subtitle && (
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {offer.subtitle}
                                        </p>
                                      )}
                                      <p className="text-sm text-muted-foreground">
                                        Paquete: {offer.package.title}
                                      </p>
                                      {offer.startAt && offer.endAt && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Válido hasta:{" "}
                                          {new Intl.DateTimeFormat("es-ES", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          }).format(new Date(offer.endAt))}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ) : offer.externalUrl ? (
                              <a
                                href={offer.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <div className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-orange-300">
                                  <div className="flex items-center gap-3">
                                    {offer.bannerImageUrl && (
                                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                          src={offer.bannerImageUrl}
                                          alt={offer.title}
                                          width={64}
                                          height={64}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium group-hover:text-orange-600 transition-colors">
                                          {offer.title}
                                        </h4>
                                        {offer.isFeatured && (
                                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                                            Destacado
                                          </Badge>
                                        )}
                                      </div>
                                      {offer.subtitle && (
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {offer.subtitle}
                                        </p>
                                      )}
                                      <p className="text-sm text-blue-600">
                                        Ver oferta externa →
                                      </p>
                                      {offer.startAt && offer.endAt && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Válido hasta:{" "}
                                          {new Intl.DateTimeFormat("es-ES", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          }).format(new Date(offer.endAt))}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </a>
                            ) : (
                              <div className="border rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                  {offer.bannerImageUrl && (
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                      <Image
                                        src={offer.bannerImageUrl}
                                        alt={offer.title}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium">
                                        {offer.title}
                                      </h4>
                                      {offer.isFeatured && (
                                        <Badge className="bg-orange-100 text-orange-800 text-xs">
                                          Destacado
                                        </Badge>
                                      )}
                                    </div>
                                    {offer.subtitle && (
                                      <p className="text-sm text-muted-foreground">
                                        {offer.subtitle}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* PDF Section */}
                  {destination.pdfUrl && (
                    <div className="sticky top-6">
                      <PdfSection
                        pdfUrl={destination.pdfUrl}
                        title={`${destination.city}, ${destination.country}`}
                        documentType="destino"
                        description="Descarga el documento PDF con toda la información completa del destino, incluyendo lugares de interés, actividades, clima y recomendaciones."
                      />
                    </div>
                  )}

                  {/* WhatsApp CTA */}
                  <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200 rounded-xl p-6 shadow-sm">
                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-green-800">
                        ¿Tienes preguntas?
                      </h3>
                      <p className="text-green-700 mb-6 text-sm sm:text-base">
                        Contáctanos por WhatsApp para obtener más información
                        sobre este destino.
                      </p>
                      <ClientWhatsAppCTA
                        whatsappTemplate={
                          whatsappTemplate
                            ? {
                                templateBody: whatsappTemplate.templateBody,
                                phoneNumber: whatsappTemplate.phoneNumber,
                                phoneNumbers: whatsappTemplate.phoneNumbers,
                              }
                            : undefined
                        }
                        label="Consultar por WhatsApp"
                        template={
                          whatsappTemplate?.templateBody ||
                          `Hola! Me interesa el destino "${destination.city}, ${destination.country}". ¿Podrían darme más información?`
                        }
                        variables={{
                          title: `${destination.city}, ${destination.country}`,
                          slug: destination.slug,
                          itemTitle: `${destination.city}, ${destination.country}`,
                          city: destination.city,
                          country: destination.country,
                        }}
                        campaign="destination_detail"
                        content={destination.slug}
                        size="default"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
