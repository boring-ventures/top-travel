import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPriceWithCurrency } from "@/lib/currency-utils";
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
  Music,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { getWhatsAppTemplateByUsage } from "@/lib/whatsapp-utils";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;

  // Fetch WhatsApp template for events
  const whatsappTemplate = await getWhatsAppTemplateByUsage("EVENTS");

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      eventTags: {
        include: {
          tag: true,
        },
      },
      destination: true,
    },
  });

  if (!event) {
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

  const formatPrice = (event: any) => {
    if (event.fromPrice) {
      return formatPriceWithCurrency(event.fromPrice, event.currency, true);
    }
    return "Consultar precio";
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
                event.heroImageUrl &&
                event.heroImageUrl !== "1" &&
                event.heroImageUrl !== "null"
                  ? event.heroImageUrl
                  : "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1920&q=80"
              }
              alt={event.title}
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
                  <Link href="/events" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Volver a eventos</span>
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
                    {event.title}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl drop-shadow-lg">
                    {event.artistOrEvent}
                  </p>

                  {/* Event Details */}
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 text-white bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="drop-shadow-lg text-sm sm:text-base">
                        {formatDate(event.startDate)}
                      </span>
                    </div>
                    {event.destination && (
                      <div className="flex items-center gap-2 text-white bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="drop-shadow-lg text-sm sm:text-base">
                          {event.destination.city}
                          {event.destination.country &&
                            `, ${event.destination.country}`}
                        </span>
                      </div>
                    )}
                    {event.venue && (
                      <div className="flex items-center gap-2 text-white bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                        <Music className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="drop-shadow-lg text-sm sm:text-base">
                          {event.venue}
                        </span>
                      </div>
                    )}
                  </div>

                  {event.fromPrice && (
                    <div className="flex items-center gap-2 text-white">
                      <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg">
                        {formatPrice(event)}
                      </span>
                    </div>
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
                  {/* Event Details */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                      Detalles del evento
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Fecha de inicio
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(event.startDate)} a las{" "}
                            {formatTime(event.startDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Fecha de fin
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(event.endDate)} a las{" "}
                            {formatTime(event.endDate)}
                          </p>
                        </div>
                      </div>
                      {event.destination && (
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Ubicación
                            </p>
                            <p className="text-sm text-gray-600">
                              {event.destination.city}
                              {event.destination.country &&
                                `, ${event.destination.country}`}
                            </p>
                          </div>
                        </div>
                      )}
                      {event.venue && (
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <Music className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">Venue</p>
                            <p className="text-sm text-gray-600">
                              {event.venue}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {event.eventTags && event.eventTags.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                        Categorías
                      </h3>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {event.eventTags.map((eventTag) => (
                          <Badge
                            key={eventTag.tag.id}
                            variant="outline"
                            className="text-sm px-3 py-1"
                          >
                            {eventTag.tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  {event.amenities && event.amenities.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                        Incluye
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {event.amenities.map(
                          (amenity: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 text-sm p-2 bg-green-50 rounded-lg"
                            >
                              <div className="h-2 w-2 bg-green-600 rounded-full flex-shrink-0" />
                              <span className="text-gray-700">{amenity}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Exclusions */}
                  {event.exclusions && event.exclusions.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                        No incluye
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {event.exclusions.map(
                          (exclusion: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 text-sm p-2 bg-red-50 rounded-lg"
                            >
                              <div className="h-2 w-2 bg-red-600 rounded-full flex-shrink-0" />
                              <span className="text-gray-700">{exclusion}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* PDF Section */}
                  {event.pdfUrl && (
                    <div className="sticky top-6">
                      <PdfSection
                        pdfUrl={event.pdfUrl}
                        title={event.title}
                        documentType="evento"
                        description="Descarga el documento PDF con toda la información completa del evento, incluyendo detalles, precios, ubicación y condiciones."
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
                        sobre este evento.
                      </p>
                      <WhatsAppCTA
                        template={
                          whatsappTemplate?.templateBody ||
                          `Hola! Me interesa el evento "${event.title}". ¿Podrían darme más información?`
                        }
                        variables={{
                          title: event.title,
                          slug: event.slug,
                          itemTitle: event.title,
                          artistOrEvent: event.artistOrEvent || "",
                          venue: event.venue || "",
                        }}
                        label="Consultar por WhatsApp"
                        phone={whatsappTemplate?.phoneNumber || "+59177355906"}
                        phoneNumbers={whatsappTemplate?.phoneNumbers || []}
                        campaign="event_detail"
                        content={event.slug}
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
