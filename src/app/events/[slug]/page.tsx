import prisma from "@/lib/prisma";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { params: Promise<{ slug: string }> };

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const evt = await prisma.event.findUnique({ where: { slug } });

  if (!evt || evt.status !== "PUBLISHED") {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
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

  const isSameDay =
    new Date(evt.startDate).toDateString() ===
    new Date(evt.endDate).toDateString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {(evt as any)?.heroImageUrl ? (
          <Image
            src={(evt as any).heroImageUrl}
            alt={evt.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={true}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="backdrop-blur-sm bg-background/80"
          >
            <Link href="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a eventos
            </Link>
          </Button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                variant="secondary"
                className="bg-primary/20 text-primary border-primary/30"
              >
                Evento
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {evt.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {evt.locationCity ?? "Ubicación por confirmar"},{" "}
                  {evt.locationCountry ?? ""}
                  {evt.venue && ` · ${evt.venue}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(evt.startDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details Card */}
            <Card className="p-6 sm:p-8">
              <div className="space-y-6">
                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Fecha
                    </div>
                    <div className="text-lg">
                      {isSameDay ? (
                        formatDate(evt.startDate)
                      ) : (
                        <>
                          {formatDate(evt.startDate)} -{" "}
                          {formatDate(evt.endDate)}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Horario
                    </div>
                    <div className="text-lg">
                      {formatTime(evt.startDate)} - {formatTime(evt.endDate)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Location Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Ubicación
                  </h3>
                  <div className="space-y-2">
                    {evt.venue && (
                      <div className="text-lg font-medium">{evt.venue}</div>
                    )}
                    <div className="text-muted-foreground">
                      {evt.locationCity}, {evt.locationCountry}
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                {evt.detailsJson && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">
                        Detalles del evento
                      </h3>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">
                          {JSON.stringify(evt.detailsJson, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </>
                )}

                {/* Artist/Event Info */}
                {evt.artistOrEvent && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Artista/Evento</h3>
                      <p className="text-lg">{evt.artistOrEvent}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Related Events */}
            <Card className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold mb-4">
                Eventos relacionados
              </h3>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Próximamente más eventos</p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      ¿Te interesa este evento?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Consulta disponibilidad, precios y reserva tu lugar
                    </p>
                  </div>

                  <WhatsAppCTA
                    label="Consultar por WhatsApp"
                    template="Hola! Me interesa el evento {title} en {city}, {country}."
                    variables={{
                      title: evt.title,
                      city: evt.locationCity ?? "",
                      country: evt.locationCountry ?? "",
                    }}
                    campaign="event_detail"
                    content={evt.slug}
                    size="lg"
                    className="w-full"
                  />

                  <Button variant="outline" size="sm" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir evento
                  </Button>
                </div>
              </Card>

              {/* Quick Info */}
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Información rápida</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span>Evento</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración:</span>
                    <span>
                      {isSameDay
                        ? "1 día"
                        : `${Math.ceil((new Date(evt.endDate).getTime() - new Date(evt.startDate).getTime()) / (1000 * 60 * 60 * 24))} días`}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const evt = await prisma.event.findUnique({ where: { slug } });
  const title = evt?.title ?? "Event";
  const description = evt?.artistOrEvent
    ? `${evt.artistOrEvent} - ${evt.locationCity ?? ""} ${evt.locationCountry ?? ""}`.trim()
    : undefined;
  const image = (evt as any)?.heroImageUrl ?? undefined;
  return pageMeta({
    title,
    description,
    urlPath: `/events/${slug}`,
    image,
  });
}
