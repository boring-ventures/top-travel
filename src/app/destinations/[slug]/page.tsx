import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { PdfSection } from "@/components/ui/pdf-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowLeft, Globe, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DestinationPage({
  params,
}: DestinationPageProps) {
  const { slug } = await params;

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
                      <WhatsAppCTA
                        template={`Hola! Me interesa el destino "${destination.city}, ${destination.country}". ¿Podrían darme más información?`}
                        variables={{}}
                        label="Consultar por WhatsApp"
                        phone="+59175651451"
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
