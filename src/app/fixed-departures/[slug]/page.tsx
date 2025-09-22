import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { PdfSection } from "@/components/ui/pdf-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Users,
  Check,
  X,
  Plane,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";

interface FixedDeparturePageProps {
  params: Promise<{ slug: string }>;
}

export default async function FixedDeparturePage({
  params,
}: FixedDeparturePageProps) {
  const { slug } = await params;

  const fixedDeparture = await prisma.fixedDeparture.findUnique({
    where: { slug },
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
  });

  if (!fixedDeparture) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getDuration = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
                fixedDeparture.heroImageUrl &&
                fixedDeparture.heroImageUrl !== "1" &&
                fixedDeparture.heroImageUrl !== "null"
                  ? fixedDeparture.heroImageUrl
                  : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80"
              }
              alt={fixedDeparture.title}
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
                    href="/fixed-departures"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      Volver a salidas fijas
                    </span>
                    <span className="sm:hidden">Volver</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
              <div className="max-w-6xl mx-auto">
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
                    {fixedDeparture.title}
                  </h1>

                  {/* Trip Details */}
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 text-white bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="drop-shadow-lg text-sm sm:text-base">
                        {fixedDeparture.destination.city},{" "}
                        {fixedDeparture.destination.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="drop-shadow-lg text-sm sm:text-base">
                        {getDuration(
                          fixedDeparture.startDate,
                          fixedDeparture.endDate
                        )}{" "}
                        días
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                      <Plane className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="drop-shadow-lg text-sm sm:text-base">
                        Salida fija
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-4 text-white">
                    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="drop-shadow-lg text-sm sm:text-base">
                        Salida: {formatDate(fixedDeparture.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="drop-shadow-lg text-sm sm:text-base">
                        Regreso: {formatDate(fixedDeparture.endDate)}
                      </span>
                    </div>
                  </div>
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
                  {/* Trip Details */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                      Detalles del viaje
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Destino</p>
                          <p className="text-sm text-gray-600">
                            {fixedDeparture.destination.city},{" "}
                            {fixedDeparture.destination.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Fecha de salida
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(fixedDeparture.startDate)} a las{" "}
                            {formatTime(fixedDeparture.startDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Fecha de regreso
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(fixedDeparture.endDate)} a las{" "}
                            {formatTime(fixedDeparture.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Duración</p>
                          <p className="text-sm text-gray-600">
                            {getDuration(
                              fixedDeparture.startDate,
                              fixedDeparture.endDate
                            )}{" "}
                            días
                          </p>
                        </div>
                      </div>
                      {fixedDeparture.seatsInfo && (
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
                          <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Información de asientos
                            </p>
                            <p className="text-sm text-gray-600">
                              {fixedDeparture.seatsInfo}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amenities */}
                  {fixedDeparture.amenities &&
                    fixedDeparture.amenities.length > 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                          Incluye
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {fixedDeparture.amenities.map(
                            (amenity: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 text-sm p-2 bg-green-50 rounded-lg"
                              >
                                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span className="text-gray-700">{amenity}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Exclusions */}
                  {fixedDeparture.exclusions &&
                    fixedDeparture.exclusions.length > 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                          No incluye
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {fixedDeparture.exclusions.map(
                            (exclusion: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 text-sm p-2 bg-red-50 rounded-lg"
                              >
                                <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                                <span className="text-gray-700">
                                  {exclusion}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Related Destination */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                      Destino relacionado
                    </h3>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full sm:w-auto bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Link
                        href={`/destinations/${fixedDeparture.destination.slug}`}
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        Ver destino: {fixedDeparture.destination.city},{" "}
                        {fixedDeparture.destination.country}
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* PDF Section */}
                  {fixedDeparture.pdfUrl && (
                    <div className="sticky top-6">
                      <PdfSection
                        pdfUrl={fixedDeparture.pdfUrl}
                        title={fixedDeparture.title}
                        documentType="salida fija"
                        description="Descarga el documento PDF con toda la información completa de la salida fija, incluyendo itinerario detallado, precios, condiciones y recomendaciones."
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
                        sobre esta salida fija.
                      </p>
                      <WhatsAppCTA
                        template={`Hola! Me interesa la salida fija "${fixedDeparture.title}". ¿Podrían darme más información?`}
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
